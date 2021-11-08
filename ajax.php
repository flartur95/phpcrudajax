<?php
$action = $_REQUEST['action'];

if (!empty($action)) {
    require_once 'includes/Item.php';
    $obj = new Item();
}

if ($action == 'additem' && !empty($_POST)) {
    $itemname = $_POST['itemname'];
    $value = $_POST['value'];
    $data = $_POST['data'];
    $photo = $_FILES['photo'];
    $itemId = (!empty($_POST['itemid'])) ? $_POST['itemid'] : '';

    // file (photo) upload
    $imagename = '';
    if (!empty($photo['name'])) {
        $imagename = $obj->uploadPhoto($photo);
        $itemvalue = [
            'itemname' => $itemname,
            'value' => $value,
            'data' => $data,
            'photo' => $imagename,
        ];
    } else {
        $itemvalue = [
            'itemname' => $itemname,
            'value' => $value,
            'data' => $data,
        ];
    }

    if ($itemId) {
        $obj->update($itemvalue, $itemId);
    } else {
        $itemId = $obj->add($itemvalue);
    }

    if (!empty($itemId)) {
        $item = $obj->getRow('id', $itemId);
        echo json_encode($item);
        exit();
    }
}

if ($action == "getitens") {
    $page = (!empty($_GET['page'])) ? $_GET['page'] : 1;
    $limit = 4;
    $start = ($page - 1) * $limit;

    $itens = $obj->getRows($start, $limit);
    if (!empty($itens)) {
        $itenslist = $itens;
    } else {
        $itenslist = [];
    }
    $total = $obj->getCount();
    $itemArr = ['count' => $total, 'itens' => $itenslist];
    die($itemArr);
    echo json_encode($itemArr);
    exit();
}

if ($action == "getitem") {
    $itemId = (!empty($_GET['id'])) ? $_GET['id'] : '';
    if (!empty($itemId)) {
        $item = $obj->getRow('id', $itemId);
        echo json_encode($item);
        exit();
    }
}

if ($action == "deleteitem") {
    $itemId = (!empty($_GET['id'])) ? $_GET['id'] : '';
    if (!empty($itemId)) {
        $isDeleted = $obj->deleteRow($itemId);
        if ($isDeleted) {
            $message = ['deleted' => 1];
        } else {
            $message = ['deleted' => 0];
        }
        echo json_encode($message);
        exit();
    }
}

if ($action == 'search') {
    $queryString = (!empty($_GET['searchQuery'])) ? trim($_GET['searchQuery']) : '';
    $results = $obj->searchitem($queryString);
    echo json_encode($results);
    exit();
}
