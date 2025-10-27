import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDropzone } from 'react-dropzone'
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw, Calendar } from 'lucide-react'
import * as XLSX from 'xlsx'

interface DataSource {
  name: string
  lastSync: string
  status: 'synced' | 'pending' | 'error'
  records: number
}

export function DataImport() {
  const [dataSources] = useState<DataSource[]>([
    { name: 'Sales Data', lastSync: '2 hours ago', status: 'synced', records: 15234 },
    { name: 'Inventory Data', lastSync: '1 hour ago', status: 'synced', records: 8945 },
    { name: 'Manufacturing Data', lastSync: '3 hours ago', status: 'synced', records: 3421 },
    { name: 'Purchases Data', lastSync: '5 hours ago', status: 'pending', records: 2103 },
    { name: 'Recipes Data', lastSync: '1 day ago', status: 'synced', records: 456 },
    { name: 'Transfers Data', lastSync: '2 hours ago', status: 'synced', records: 789 },
    { name: 'Waste Data', lastSync: '4 hours ago', status: 'synced', records: 234 },
  ])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const json = XLSX.utils.sheet_to_json(worksheet)

          console.log(`Processed ${file.name}:`, json.length, 'records')

          // In production, this would upload to your backend/database
          alert(`Successfully processed ${file.name} with ${json.length} records`)
        } catch (error) {
          console.error('Error processing file:', error)
          alert('Error processing file. Please check the format.')
        }
      }

      reader.readAsBinaryString(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'pending':
        return <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'synced':
        return 'secondary'
      case 'pending':
        return 'outline'
      case 'error':
        return 'destructive'
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
        <h1 className="text-4xl font-bold tracking-tight">Data Import</h1>
        <p className="text-muted-foreground mt-2">
          Upload and sync Excel files from SharePoint or local sources
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">7</CardTitle>
            <CardDescription>Data Sources</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">All Connected</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">31,182</CardTitle>
            <CardDescription>Total Records</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge>Synced Today</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Auto-Sync
            </CardTitle>
            <CardDescription>Next sync in 45 min</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Daily at 12:00 AM</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manual Upload</CardTitle>
          <CardDescription>
            Upload Excel files (.xlsx, .xls, .csv) for immediate processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
            `}
          >
            <input {...getInputProps()} />
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: isDragActive ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              <Upload className="h-12 w-12 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg font-medium">Drop files here...</p>
              ) : (
                <>
                  <p className="text-lg font-medium">Drag & drop Excel files here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                  <Button variant="outline">Select Files</Button>
                </>
              )}
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>SharePoint Data Sources</CardTitle>
              <CardDescription>Automated daily sync from SharePoint</CardDescription>
            </div>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dataSources.map((source, index) => (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">{source.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Last synced: {source.lastSync} • {source.records.toLocaleString()} records
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusIcon(source.status)}
                  <Badge variant={getStatusVariant(source.status)}>
                    {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SharePoint Integration Setup</CardTitle>
          <CardDescription>
            For automated daily sync, configure SharePoint connection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">Configuration Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Set up SharePoint API credentials in environment variables</li>
                <li>Configure file paths for each data source (Sales, Inventory, etc.)</li>
                <li>Set up automated sync schedule (default: daily at midnight)</li>
                <li>Enable webhook notifications for real-time updates</li>
                <li>Test connection and verify data mapping</li>
              </ol>
            </div>
            <div className="flex gap-2">
              <Button>Configure SharePoint</Button>
              <Button variant="outline">Test Connection</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
