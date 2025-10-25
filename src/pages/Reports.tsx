import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, TrendingUp, Calendar } from 'lucide-react'

export function Reports() {
  const reports = [
    {
      name: 'Weekly Sales Report',
      description: 'Comprehensive sales analysis for the week',
      generated: '2 hours ago',
      type: 'Sales',
      size: '2.4 MB',
    },
    {
      name: 'Inventory Status',
      description: 'Current stock levels across all locations',
      generated: '1 day ago',
      type: 'Inventory',
      size: '1.8 MB',
    },
    {
      name: 'Branch Performance',
      description: 'Performance metrics for all branches',
      generated: '3 days ago',
      type: 'Performance',
      size: '3.1 MB',
    },
    {
      name: 'Monthly Financial Summary',
      description: 'Financial overview for the month',
      generated: '1 week ago',
      type: 'Financial',
      size: '4.5 MB',
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
          <h1 className="text-4xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-2">Generate and download business reports</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generate New Report
        </Button>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">24</CardTitle>
            <CardDescription>Reports This Month</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12% from last month
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">5</CardTitle>
            <CardDescription>Scheduled Reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge>Auto-generated</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Next Report
            </CardTitle>
            <CardDescription>Monday, 8:00 AM</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Weekly Sales</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Download or view previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report, index) => (
              <motion.div
                key={report.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {report.description} • Generated {report.generated}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge variant="outline">{report.type}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{report.size}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
            <CardDescription>Generate instant reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Daily Sales Summary
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Inventory Snapshot
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Order Status Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Waste Analysis
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheduled Reports</CardTitle>
            <CardDescription>Automated report generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Weekly Sales', schedule: 'Every Monday, 8:00 AM' },
              { name: 'Monthly Financial', schedule: '1st of each month' },
              { name: 'Inventory Review', schedule: 'Every Friday, 5:00 PM' },
            ].map((scheduled, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{scheduled.name}</p>
                  <p className="text-sm text-muted-foreground">{scheduled.schedule}</p>
                </div>
                <Badge>Active</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
