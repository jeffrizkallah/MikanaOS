import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Brain } from 'lucide-react'

export function AIInsights() {
  const insights = [
    {
      type: 'recommendation',
      title: 'Optimize Inventory Levels',
      description: 'Based on sales patterns, consider reducing chicken breast stock by 15% to minimize waste.',
      impact: 'High',
      confidence: 94,
      icon: Lightbulb,
    },
    {
      type: 'prediction',
      title: 'Increased Demand Expected',
      description: 'Sales forecasts suggest a 22% increase in demand next week. Consider increasing Thursday order.',
      impact: 'Medium',
      confidence: 87,
      icon: TrendingUp,
    },
    {
      type: 'alert',
      title: 'Potential Stockout Warning',
      description: 'Olive oil inventory may run out by Friday based on current consumption rates.',
      impact: 'High',
      confidence: 91,
      icon: AlertTriangle,
    },
    {
      type: 'recommendation',
      title: 'Cost Optimization Opportunity',
      description: 'Switching to alternative supplier for tomatoes could save approximately $450/week.',
      impact: 'Medium',
      confidence: 78,
      icon: Sparkles,
    },
  ]

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'destructive'
      case 'Medium':
        return 'default'
      case 'Low':
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
      >
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
          <Brain className="h-10 w-10 text-primary" />
          AI Insights
        </h1>
        <p className="text-muted-foreground mt-2">
          Intelligent recommendations and predictions powered by AI
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">12</CardTitle>
            <CardDescription>Active Insights</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Updated hourly</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">89%</CardTitle>
            <CardDescription>Average Confidence</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge>High Accuracy</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">$12.4K</CardTitle>
            <CardDescription>Potential Savings</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">This Month</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Insights</CardTitle>
              <CardDescription>AI-generated recommendations and alerts</CardDescription>
            </div>
            <Button variant="outline">
              <Sparkles className="mr-2 h-4 w-4" />
              Refresh Insights
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <insight.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{insight.title}</h3>
                          <div className="flex gap-2">
                            <Badge variant={getImpactColor(insight.impact)}>
                              {insight.impact} Impact
                            </Badge>
                            <Badge variant="outline">{insight.confidence}% confident</Badge>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">{insight.description}</p>
                        <div className="flex gap-2">
                          <Button size="sm">Apply Recommendation</Button>
                          <Button size="sm" variant="outline">
                            Learn More
                          </Button>
                          <Button size="sm" variant="ghost">
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Model Performance</CardTitle>
            <CardDescription>Accuracy metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { model: 'Sales Forecasting', accuracy: 92 },
              { model: 'Demand Prediction', accuracy: 87 },
              { model: 'Inventory Optimization', accuracy: 94 },
              { model: 'Cost Analysis', accuracy: 85 },
            ].map((model, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{model.model}</span>
                  <span className="text-muted-foreground">{model.accuracy}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${model.accuracy}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insight Categories</CardTitle>
            <CardDescription>Breakdown by type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { category: 'Cost Optimization', count: 4, color: 'bg-blue-500' },
              { category: 'Demand Forecasting', count: 3, color: 'bg-green-500' },
              { category: 'Risk Alerts', count: 2, color: 'bg-red-500' },
              { category: 'Efficiency Tips', count: 3, color: 'bg-yellow-500' },
            ].map((cat, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <span className="font-medium">{cat.category}</span>
                </div>
                <Badge variant="secondary">{cat.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
