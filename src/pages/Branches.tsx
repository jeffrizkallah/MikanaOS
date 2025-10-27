import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, MapPin, Users } from 'lucide-react'

export function Branches() {
  const branches = [
    {
      id: 1,
      name: 'Branch A - Downtown',
      location: '123 Main St, City Center',
      manager: 'Sarah Johnson',
      employees: 12,
      status: 'Active',
      type: 'Branch',
    },
    {
      id: 2,
      name: 'Branch B - Westside',
      location: '456 West Ave, Westside',
      manager: 'Mike Chen',
      employees: 10,
      status: 'Active',
      type: 'Branch',
    },
    {
      id: 3,
      name: 'Central Kitchen',
      location: '789 Industrial Blvd',
      manager: 'Robert Smith',
      employees: 25,
      status: 'Active',
      type: 'Kitchen',
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">Branches</h1>
        <p className="text-muted-foreground mt-2">Manage all branch locations and central kitchen</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">12</CardTitle>
            <CardDescription>Total Branches</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">All Active</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">1</CardTitle>
            <CardDescription>Central Kitchen</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge>Operational</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">147</CardTitle>
            <CardDescription>Total Employees</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Active</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {branches.map((branch, index) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{branch.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {branch.location}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={branch.type === 'Kitchen' ? 'default' : 'secondary'}>
                    {branch.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Manager</span>
                    <span className="text-sm font-medium">{branch.manager}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Employees
                    </span>
                    <span className="text-sm font-medium">{branch.employees}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {branch.status}
                    </Badge>
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
