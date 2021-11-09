 
  <?php
//Database connection by using PHP PDO
$username = 'root';
$password = '';
$connection = new PDO( 'mysql:host=localhost;dbname=testedbdois', $username, $password ); // Create Object of PDO class by connecting to Mysql database

if(isset($_POST["action"])) //Check value of $_POST["action"] variable value is set to not
{
 //For Load All Data
 if($_POST["action"] == "Load") 
 {
  $statement = $connection->prepare("SELECT * FROM products ORDER BY id DESC");
  $statement->execute();
  $result = $statement->fetchAll();
  $output = '';
  $output .= '
   <table class="table table-bordered">
    <tr>
     <th>Product Name</th>
     <th>Value Name</th>
     <th>Update</th>
     <th>Delete</th>
    </tr>
  ';
  if($statement->rowCount() > 0)
  {
   foreach($result as $row)
   {
    $output .= '
    <tr>
     <td>'.$row["product_name"].'</td>
     <td>'.$row["product_value"].'</td>
     <td><button type="button" id="'.$row["id"].'" class="btn btn-warning btn-xs update">Update</button></td>
     <td><button type="button" id="'.$row["id"].'" class="btn btn-danger btn-xs delete">Delete</button></td>
    </tr>
    ';
   }
  }
  else
  {
   $output .= '
    <tr>
     <td align="center">Data not Found</td>
    </tr>
   ';
  }
  $output .= '</table>';
  echo $output;
 }

 //This code for Create new Records
 if($_POST["action"] == "Create")
 {
  $statement = $connection->prepare("
   INSERT INTO products (product_name, product_value) 
   VALUES (:product_name, :product_value)
  ");
  $result = $statement->execute(
   array(
    ':product_name' => $_POST["firstName"],
    ':product_value' => $_POST["lastName"]
   )
  );
  if(!empty($result))
  {
   echo 'Data Inserted';
  }
 }

 //This Code is for fetch single product data for display on Modal
 if($_POST["action"] == "Select")
 {
  $output = array();
  $statement = $connection->prepare(
   "SELECT * FROM products 
   WHERE id = '".$_POST["id"]."' 
   LIMIT 1"
  );
  $statement->execute();
  $result = $statement->fetchAll();
  foreach($result as $row)
  {
   $output["product_name"] = $row["product_name"];
   $output["product_value"] = $row["product_value"];
  }
  echo json_encode($output);
 }

 if($_POST["action"] == "Update")
 {
  $statement = $connection->prepare(
   "UPDATE products 
   SET product_name = :product_name, product_value = :product_value 
   WHERE id = :id
   "
  );
  $result = $statement->execute(
   array(
    ':product_name' => $_POST["firstName"],
    ':product_value' => $_POST["lastName"],
    ':id'   => $_POST["id"]
   )
  );
  if(!empty($result))
  {
   echo 'Data Updated';
  }
 }

 if($_POST["action"] == "Delete")
 {
  $statement = $connection->prepare(
   "DELETE FROM products WHERE id = :id"
  );
  $result = $statement->execute(
   array(
    ':id' => $_POST["id"]
   )
  );
  if(!empty($result))
  {
   echo 'Data Deleted';
  }
 }

}

?>