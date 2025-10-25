import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Mail, Phone } from 'lucide-react'

export function Suppliers() {
  const suppliers = [
    {
      id: 1,
      name: 'Fresh Farms Co.',
      category: 'Produce',
      contact: 'john@freshfarms.com',
      phone: '+1 234 567 8901',
      status: 'Active',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Ocean Catch Seafood',
      category: 'Seafood',
      contact: 'sales@oceancatch.com',
      phone: '+1 234 567 8902',
      status: 'Active',
      rating: 4.6,
    },
    {
      id: 3,
      name: 'Premium Meats Ltd',
      category: 'Meat',
      contact: 'orders@premiummeats.com',
      phone: '+1 234 567 8903',
      status: 'Active',
      rating: 4.9,
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground mt-2">Manage supplier relationships and contacts</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier, index) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <CardDescription>{supplier.category}</CardDescription>
                  </div>
                  <Badge>{supplier.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{supplier.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{supplier.phone}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <span className="font-bold">{supplier.rating} / 5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
