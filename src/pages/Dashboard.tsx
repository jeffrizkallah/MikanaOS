import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { Package, ShoppingCart, TrendingUp, DollarSign, Users, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const StatCard = ({ title, value, icon: Icon, trend, description }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>{' '}
            from last week
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  </motion.div>
)

const BranchManagerDashboard = () => {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Branch Manager Dashboard</h2>
          <p className="text-muted-foreground">
            Managing {user?.branches?.length || 0} branches
          </p>
        </div>
        <Badge variant="secondary">Next Order: Thursday</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Inventory"
          value="2,345"
          icon={Package}
          trend={12}
        />
        <StatCard
          title="Pending Orders"
          value="8"
          icon={ShoppingCart}
          description="Awaiting approval"
        />
        <StatCard
          title="Weekly Sales"
          value="$24,500"
          icon={DollarSign}
          trend={8.5}
        />
        <StatCard
          title="Low Stock Items"
          value="15"
          icon={AlertCircle}
          description="Needs attention"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Branches</CardTitle>
            <CardDescription>Quick overview of managed locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user?.branches?.map((branch) => (
                <div key={branch} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="font-medium">{branch}</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              ))}
              {(!user?.branches || user.branches.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No branches assigned yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Dispatch</CardTitle>
            <CardDescription>Next delivery schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-primary/5">
                <div>
                  <p className="font-medium">Thursday Dispatch</p>
                  <p className="text-sm text-muted-foreground">Order deadline: Wednesday 6 PM</p>
                </div>
                <Badge>2 days</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Saturday Dispatch</p>
                  <p className="text-sm text-muted-foreground">Order deadline: Friday 6 PM</p>
                </div>
                <Badge variant="outline">4 days</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const HeadOfficeDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Head Office Dashboard</h2>
        <p className="text-muted-foreground">Central kitchen operations overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Production Volume"
          value="15,280 kg"
          icon={Package}
          trend={15}
        />
        <StatCard
          title="Active Orders"
          value="24"
          icon={ShoppingCart}
          description="From all branches"
        />
        <StatCard
          title="This Week Revenue"
          value="$156,400"
          icon={DollarSign}
          trend={22.5}
        />
        <StatCard
          title="Efficiency Rate"
          value="94.2%"
          icon={TrendingUp}
          trend={3.1}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Branch Orders Summary</CardTitle>
            <CardDescription>Orders by branch for this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Branch A', 'Branch B', 'Branch C', 'Branch D'].map((branch, i) => (
                <div key={branch} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="font-medium">{branch}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">${(12000 + i * 2000).toLocaleString()}</span>
                    <Badge variant="secondary">{3 + i} orders</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manufacturing Status</CardTitle>
            <CardDescription>Current production pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Thursday Batch</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Saturday Batch</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">Complete system overview and analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$342,800"
          icon={DollarSign}
          trend={18.2}
        />
        <StatCard
          title="All Branches"
          value="12"
          icon={Users}
          description="+ 1 central kitchen"
        />
        <StatCard
          title="System Users"
          value="47"
          icon={Users}
          trend={6}
        />
        <StatCard
          title="Overall Efficiency"
          value="91.8%"
          icon={TrendingUp}
          trend={4.2}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Real-time monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Data Sync', status: 'Online', color: 'bg-green-500' },
                { name: 'SharePoint Integration', status: 'Online', color: 'bg-green-500' },
                { name: 'AI Services', status: 'Online', color: 'bg-green-500' },
                { name: 'Database', status: 'Online', color: 'bg-green-500' },
              ].map((service) => (
                <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="font-medium">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${service.color}`} />
                    <span className="text-sm text-muted-foreground">{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: 'Data import completed', time: '2 min ago' },
                { action: 'New order from Branch A', time: '15 min ago' },
                { action: 'Inventory updated', time: '1 hour ago' },
                { action: 'User John Doe logged in', time: '2 hours ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">{activity.action}</span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function Dashboard() {
  const { user } = useAuthStore()

  const getRoleTab = (role: string) => {
    switch (role) {
      case 'branch-manager':
        return 'branch-manager'
      case 'head-office':
        return 'head-office'
      case 'admin':
        return 'admin'
      default:
        return 'branch-manager'
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground mt-2">Here's what's happening with your business today.</p>
      </motion.div>

      <Tabs defaultValue={getRoleTab(user?.role || 'branch-manager')} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="branch-manager">Branch Managers</TabsTrigger>
          <TabsTrigger value="head-office">Head Office</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="branch-manager" className="space-y-4">
          <BranchManagerDashboard />
        </TabsContent>

        <TabsContent value="head-office" className="space-y-4">
          <HeadOfficeDashboard />
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <AdminDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
