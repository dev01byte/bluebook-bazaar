-- Add INSERT policy for order_items so users can create order items for their own orders
CREATE POLICY "Users can create order items for their orders"
ON order_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.buyer_id = auth.uid()
  )
);