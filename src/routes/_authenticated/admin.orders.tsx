import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

const STATUSES = ["pending", "confirmed", "delivered", "cancelled"];

function AdminOrders() {
  const queryClient = useQueryClient();

  const orders = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(id,product_name,unit_price,quantity,line_total)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Order updated");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {orders.data?.length ?? 0} WhatsApp checkout orders.
      </p>

      <div className="surface-panel mt-8 overflow-x-auto rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Placed</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(orders.data ?? []).map((order) => {
              const items =
                (order.order_items as { id: string; product_name: string; quantity: number }[]) ??
                [];
              return (
                <TableRow key={order.id as string}>
                  <TableCell className="font-medium">{order.order_number as string}</TableCell>
                  <TableCell>
                    <div>{order.customer_name as string}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.customer_phone as string}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-64 text-xs text-muted-foreground">
                    {items.map((item) => `${item.quantity}x ${item.product_name}`).join(", ")}
                  </TableCell>
                  <TableCell>{formatPrice(Number(order.total))}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(order.created_at as string).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status as string}
                      onValueChange={(status) =>
                        updateStatus.mutate({ id: order.id as string, status })
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((status) => (
                          <SelectItem key={status} value={status} className="capitalize">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
