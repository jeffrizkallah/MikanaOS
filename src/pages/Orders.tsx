import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Calendar } from 'lucide-react'

export function Orders() {
  const orders = [
    {
      id: 'ORD-001',
      branch: 'Branch A',
      date: '2024-10-20',
      status: 'Pending',
      total: '$4,250',
      items: 12,
    },
    {
      id: 'ORD-002',
      branch: 'Branch B',
      date: '2024-10-21',
      status: 'Approved',
      total: '$3,800',
      items: 10,
    },
    {
      id: 'ORD-003',
      branch: 'Branch C',
      date: '2024-10-22',
      status: 'In Progress',
      total: '$5,100',
      items: 15,
    },
    {
      id: 'ORD-004',
      branch: 'Central Kitchen',
      date: '2024-10-23',
      status: 'Completed',
      total: '$12,400',
      items: 28,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'secondary'
      case 'Approved':
        return 'default'
      case 'In Progress':
        return 'outline'
      case 'Completed':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-2">Manage weekly orders from all branches</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Next Dispatch Schedule</CardTitle>
            <CardDescription>Upcoming delivery dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Thursday Dispatch</span>
              </div>
              <Badge>2 days left</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Saturday Dispatch</span>
              </div>
              <Badge variant="outline">4 days left</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Statistics</CardTitle>
            <CardDescription>This week's overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Orders</span>
              <span className="text-2xl font-bold">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Value</span>
              <span className="text-2xl font-bold">$25,550</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending Approval</span>
              <span className="text-2xl font-bold">8</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from all branches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{order.id}</h3>
                    <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.branch} • {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{order.total}</p>
                  <p className="text-sm text-muted-foreground">{order.items} items</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
