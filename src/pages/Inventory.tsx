import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, Download } from 'lucide-react'

export function Inventory() {
  const inventoryItems = [
    { id: 1, name: 'Chicken Breast', quantity: 450, unit: 'kg', status: 'In Stock', location: 'Cold Storage A' },
    { id: 2, name: 'Tomatoes', quantity: 120, unit: 'kg', status: 'In Stock', location: 'Fresh Produce' },
    { id: 3, name: 'Olive Oil', quantity: 25, unit: 'L', status: 'Low Stock', location: 'Dry Storage' },
    { id: 4, name: 'Pasta', quantity: 200, unit: 'kg', status: 'In Stock', location: 'Dry Storage' },
    { id: 5, name: 'Salmon', quantity: 15, unit: 'kg', status: 'Low Stock', location: 'Cold Storage B' },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground mt-2">Track and manage all inventory across locations</p>
      </motion.div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search inventory..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
          <CardDescription>Real-time stock levels across all locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {inventoryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.location}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{item.quantity} {item.unit}</p>
                    <Badge variant={item.status === 'Low Stock' ? 'destructive' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
