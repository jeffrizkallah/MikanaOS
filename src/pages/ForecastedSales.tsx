import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Calendar, DollarSign } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export function ForecastedSales() {
  const forecastData = [
    { day: 'Mon', actual: 4200, forecast: 4100, lastYear: 3800 },
    { day: 'Tue', actual: 3800, forecast: 3900, lastYear: 3600 },
    { day: 'Wed', actual: 4100, forecast: 4200, lastYear: 3900 },
    { day: 'Thu', actual: 4500, forecast: 4400, lastYear: 4200 },
    { day: 'Fri', actual: 5200, forecast: 5100, lastYear: 4800 },
    { day: 'Sat', actual: 5800, forecast: 5700, lastYear: 5400 },
    { day: 'Sun', actual: 4900, forecast: 5000, lastYear: 4600 },
  ]

  const nextWeekForecast = [
    { day: 'Mon', forecast: 4300, confidence: 'high' },
    { day: 'Tue', forecast: 4000, confidence: 'high' },
    { day: 'Wed', forecast: 4400, confidence: 'medium' },
    { day: 'Thu', forecast: 4700, confidence: 'high' },
    { day: 'Fri', forecast: 5400, confidence: 'medium' },
    { day: 'Sat', forecast: 6000, confidence: 'medium' },
    { day: 'Sun', forecast: 5200, confidence: 'high' },
  ]

  const monthlyForecast = [
    { month: 'Jan', sales: 124500 },
    { month: 'Feb', sales: 118200 },
    { month: 'Mar', sales: 135800 },
    { month: 'Apr', sales: 142300 },
    { month: 'May', sales: 151200 },
    { month: 'Jun', sales: 148900 },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">Forecasted Sales</h1>
        <p className="text-muted-foreground mt-2">
          AI-powered sales predictions and trend analysis
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Week Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$32,500</div>
            <Badge variant="secondary" className="mt-2">
              <TrendingUp className="mr-1 h-3 w-3" />
              +8.2% vs last week
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next Week Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$34,000</div>
            <Badge variant="secondary" className="mt-2">
              <TrendingUp className="mr-1 h-3 w-3" />
              +4.6% increase
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$142,800</div>
            <Badge className="mt-2">
              <TrendingUp className="mr-1 h-3 w-3" />
              On target
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Forecast Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <Badge variant="outline" className="mt-2">
              Last 30 days
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>This Week - Actual vs Forecast</CardTitle>
          <CardDescription>Comparing actual sales with AI predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="day" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Actual Sales"
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Forecast"
              />
              <Line
                type="monotone"
                dataKey="lastYear"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1}
                opacity={0.5}
                name="Last Year"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Next Week Forecast</CardTitle>
            <CardDescription>Daily sales predictions with confidence levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nextWeekForecast.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{day.day}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">${day.forecast.toLocaleString()}</span>
                    <Badge variant={day.confidence === 'high' ? 'default' : 'outline'}>
                      {day.confidence}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
            <CardDescription>6-month sales forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyForecast}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Forecast Insights</CardTitle>
          <CardDescription>Key takeaways from sales predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    Weekend Surge Expected
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Forecast predicts 18% increase in weekend sales. Consider increasing inventory.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Revenue Target on Track
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Current trajectory suggests meeting monthly revenue goal with 96% confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
