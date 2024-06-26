<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $accountId = $_GET['accountId'];

        $sql = "SELECT uo.*, 
                    pp.productSize, 
                    pi.productBrand, 
                    pi.productName, 
                    pi.productFlavor, 
                    pi.productImage, 
                    si.shopName,
                    pr.rating, 
                    pr.feedback
                FROM user_order uo
                INNER JOIN product_info pi ON uo.productID = pi.productID
                INNER JOIN shop_info si ON pi.shopID = si.shopID
                INNER JOIN product_price pp ON uo.priceID = pp.priceID
                LEFT JOIN product_review pr ON uo.orderID = pr.orderID
                WHERE uo.accountID = :accountId
                ORDER BY uo.orderDate DESC";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':accountId', $accountId);
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($orders) {
            echo json_encode($orders);
        } else {
            $response = ["status" => 0, "message" => "No orders found for the specified account"];
            echo json_encode($response);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'));

        $accountId = $data->accountId;
        $orderId = $data->orderId;
        $status = $data->status;
        $cancelReason = $data->cancelReason;

        $sql = "UPDATE user_order SET status = :status, cancelReason = :cancelReason WHERE accountID = :accountId AND orderID = :orderId";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':accountId', $accountId);
        $stmt->bindParam(':orderId', $orderId);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':cancelReason', $cancelReason);

        if ($status == "cancel requested" && $stmt->execute()) {
            $response = ["status" => 1, "message" => "Cancellation has been successfully requested"];
        } else if ($status == "order received" && $stmt->execute()) {
            $response = ["status" => 1, "message" => "Order has been successfully received"];
        } else {
            $response = ["status" => 0, "message" => "Something went wrong"];
        }

        echo json_encode($response);
        break;

    default:
        echo json_encode(["status" => 0, "message" => "Invalid request method"]);
        break;
}
?>