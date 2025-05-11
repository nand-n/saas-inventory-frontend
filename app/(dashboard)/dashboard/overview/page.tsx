

// 'use client'
// import React from 'react'
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   Legend
// } from 'recharts'

// const salesData = [
//   { name: 'Jan', sales: 4000 },
//   { name: 'Feb', sales: 3000 },
//   { name: 'Mar', sales: 5000 },
//   { name: 'Apr', sales: 4000 },
//   { name: 'May', sales: 6000 },
//   { name: 'Jun', sales: 7000 }
// ]

// const userGrowthData = [
//   { month: 'Jan', users: 1000 },
//   { month: 'Feb', users: 1200 },
//   { month: 'Mar', users: 1500 },
//   { month: 'Apr', users: 1600 },
//   { month: 'May', users: 2000 },
//   { month: 'Jun', users: 2500 }
// ]

// const subscriptionData = [
//   { name: 'Basic', value: 500 },
//   { name: 'Pro', value: 300 },
//   { name: 'Enterprise', value: 200 }
// ]

// const revenueByPlanData = [
//   { month: 'Jan', basic: 4000, pro: 6000, enterprise: 10000 },
//   { month: 'Feb', basic: 3000, pro: 7000, enterprise: 12000 },
//   { month: 'Mar', basic: 5000, pro: 8000, enterprise: 15000 },
//   { month: 'Apr', basic: 4000, pro: 9000, enterprise: 13000 },
//   { month: 'May', basic: 6000, pro: 10000, enterprise: 16000 },
//   { month: 'Jun', basic: 7000, pro: 11000, enterprise: 18000 }
// ]

// const recentActivities = [
//   { id: 1, description: 'New subscription (Pro plan)', date: '2024-03-15', amount: '$99' },
//   { id: 2, description: 'Upgrade to Enterprise plan', date: '2024-03-14', amount: '$299' },
//   { id: 3, description: 'Monthly renewal (Basic plan)', date: '2024-03-13', amount: '$49' },
//   { id: 4, description: 'Payment failed', date: '2024-03-12', amount: '-$49' }
// ]

// const supportTicketsData = [
//   { name: 'Open', value: 12, color: '#FF8042' },
//   { name: 'In Progress', value: 8, color: '#FFBB28' },
//   { name: 'Closed', value: 30, color: '#00C49F' }
// ]

// const COLORS = ['#00C49F', '#FF8042', '#FFBB28', '#0088FE', '#00C49F', '#FFBB28']

// const insights = [
//   { label: 'Total Users', value: '1,250' },
//   { label: 'Active Subscriptions', value: '984' },
//   { label: 'MRR', value: '$21,340' },
//   { label: 'ARR', value: '$256,080' },
//   { label: 'Churn Rate', value: '2.3%' },
//   { label: 'ARPU', value: '$45.20' }
// ]

// const OverviewPage = () => {
//   return (
//     <Card className="h-full w-full p-4 space-y-4">
//       <CardHeader className="flex justify-between items-center">
//         <CardTitle className="text-xl font-bold">SaaS Dashboard Overview</CardTitle>
//       </CardHeader>

//       <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//         {insights.map((insight, idx) => (
//           <Card key={idx} className="p-4">
//             <p className="text-sm text-muted-foreground">{insight.label}</p>
//             <p className="text-xl font-semibold mt-2">{insight.value}</p>
//           </Card>
//         ))}
//       </CardContent>

//       <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-4">
//         <Card className="p-4">
//           <h3 className="text-lg font-medium mb-4">Monthly Recurring Revenue</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={salesData}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="sales" fill="#4F46E5" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </Card>

//         <Card className="p-4">
//           <h3 className="text-lg font-medium mb-4">User Growth</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={userGrowthData}>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="users" stroke="#4F46E5" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </Card>
//       </CardContent>

//       <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-4">
//         <Card className="p-4">
//           <h3 className="text-lg font-medium mb-4">Revenue by Plan</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={revenueByPlanData}>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="basic" stackId="a" fill="#8884d8" />
//               <Bar dataKey="pro" stackId="a" fill="#82ca9d" />
//               <Bar dataKey="enterprise" stackId="a" fill="#ffc658" />
//             </BarChart>
//           </ResponsiveContainer>
//         </Card>

//         <Card className="p-4">
//           <h3 className="text-lg font-medium mb-4">Subscription Plans</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={subscriptionData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 label
//               >
//                 {subscriptionData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </Card>
//       </CardContent>

//       <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Card className="p-4">
//           <h3 className="text-lg font-medium mb-4">Recent Activities</h3>
//           <div className="space-y-4">
//             {recentActivities.map((activity) => (
//               <div key={activity.id} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded">
//                 <div>
//                   <p className="text-sm font-medium">{activity.description}</p>
//                   <p className="text-xs text-muted-foreground">{activity.date}</p>
//                 </div>
//                 <span className="text-sm font-medium">{activity.amount}</span>
//               </div>
//             ))}
//           </div>
//         </Card>

//         <Card className="p-4">
//           <h3 className="text-lg font-medium mb-4">Support Tickets</h3>
//           <div className="flex items-center justify-between h-full">
//             <ResponsiveContainer width="40%" height={150}>
//               <PieChart>
//                 <Pie
//                   data={supportTicketsData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={40}
//                   outerRadius={60}
//                 >
//                   {supportTicketsData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="space-y-3">
//               {supportTicketsData.map((ticket) => (
//                 <div key={ticket.name} className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ticket.color }} />
//                   <span className="text-sm">{ticket.name}: {ticket.value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Card>
//       </CardContent>
//     </Card>
//   )
// }

// export default OverviewPage

'use client'
import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  ScatterChart,
  Scatter
} from 'recharts'

const inventoryData = [
  { branch: 'Main Warehouse', stock: 4500, lowStock: 150, outOfStock: 25 },
  { branch: 'North Branch', stock: 3200, lowStock: 200, outOfStock: 15 },
  { branch: 'Export Hub', stock: 6800, lowStock: 300, outOfStock: 40 }
]

const orderStatusData = [
  { status: 'Pending', value: 120 },
  { status: 'Processing', value: 45 },
  { status: 'Shipped', value: 85 },
  { status: 'Delivered', value: 200 }
]

const shipmentData = [
  { day: 'Mon', air: 5, sea: 12, land: 35 },
  { day: 'Tue', air: 7, sea: 15, land: 40 },
  { day: 'Wed', air: 4, sea: 10, land: 30 },
  { day: 'Thu', air: 6, sea: 18, land: 45 },
  { day: 'Fri', air: 8, sea: 20, land: 50 }
]

const supplyChainMetrics = [
  { branch: 'NYC', inventoryValue: 450000, turnover: 3.2, accuracy: 98.5 },
  { branch: 'LON', inventoryValue: 320000, turnover: 2.8, accuracy: 97.2 },
  { branch: 'DXB', inventoryValue: 680000, turnover: 4.1, accuracy: 99.0 }
]

const recentTransactions = [
  { id: 1, type: 'Stock Adjustment', item: 'Frozen Goods', quantity: '+500', branch: 'Main Warehouse' },
  { id: 2, type: 'Purchase Order', item: 'Packaging Materials', quantity: '2000', branch: 'Export Hub' },
  { id: 3, type: 'Shipment', item: 'Electronics', quantity: '-1500', branch: 'North Branch' },
  { id: 4, type: 'Return', item: 'Perishables', quantity: '+200', branch: 'Main Warehouse' }
]

const COLORS = ['#00C49F', '#FF8042', '#FFBB28', '#0088FE', '#82ca9d', '#ffc658']

const insights = [
  { label: 'Total Inventory Value', value: '$1.45M' },
  { label: 'Avg. Turnover Rate', value: '3.4x' },
  { label: 'Order Accuracy', value: '98.2%' },
  { label: 'Pending Orders', value: '165' },
  { label: 'In-Transit', value: '89' },
  { label: 'Warehouse Utilization', value: '82%' }
]

const branchData = [
  { name: 'North Branch', value: 35 },
  { name: 'Main Warehouse', value: 45 },
  { name: 'Export Hub', value: 20 }
]

const InventoryDashboard = () => {
  return (
    <Card className="h-full w-full p-4 space-y-4">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl font-bold">Supply Chain Intelligence Dashboard</CardTitle>
        <div className="flex gap-2">
          <select className="p-2 border rounded-lg">
            <option>All Branches</option>
            <option>Main Warehouse</option>
            <option>North Branch</option>
            <option>Export Hub</option>
          </select>
          <select className="p-2 border rounded-lg">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {insights.map((insight, idx) => (
          <Card key={idx} className="p-4">
            <p className="text-sm text-muted-foreground">{insight.label}</p>
            <p className="text-xl font-semibold mt-2">{insight.value}</p>
          </Card>
        ))}
      </CardContent>

      <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Inventory Distribution by Branch</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inventoryData}>
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" stackId="a" fill="#4F46E5" />
              <Bar dataKey="lowStock" stackId="a" fill="#FFBB28" />
              <Bar dataKey="outOfStock" stackId="a" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </CardContent>

      <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Shipment Methods Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={shipmentData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="air" stroke="#FF8042" />
              <Line type="monotone" dataKey="sea" stroke="#0088FE" />
              <Line type="monotone" dataKey="land" stroke="#00C49F" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Branch Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="turnover" name="Turnover Rate" />
              <YAxis type="number" dataKey="accuracy" name="Accuracy %" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter
                name="Branches"
                data={supplyChainMetrics}
                fill="#4F46E5"
              />
              <Legend />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
      </CardContent>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded">
                <div>
                  <p className="text-sm font-medium">{txn.type}</p>
                  <p className="text-xs text-muted-foreground">{txn.item} • {txn.branch}</p>
                </div>
                <span className="text-sm font-medium">{txn.quantity}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Warehouse Utilization</h3>
          <div className="flex items-center justify-between h-full">
            <ResponsiveContainer width="40%" height={150}>
              <PieChart>
                <Pie
                  data={branchData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                >
                  {branchData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {branchData.map((branch) => (
                <div key={branch.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ 
                    backgroundColor: COLORS[branchData.indexOf(branch) % COLORS.length] 
                  }} />
                  <span className="text-sm">{branch.name}: {branch.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </CardContent>
    </Card>
  )
}

export default InventoryDashboard