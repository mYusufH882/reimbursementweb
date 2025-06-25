import './globals.css'

export const metadata = {
  title: 'Reimburse - Employee Reimbursement Management',
  description: 'Streamline your employee reimbursement process with our comprehensive management system.',
  keywords: 'reimbursement, employee, expense, management, approval',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💰</text></svg>" />
      </head>
      <body className="antialiased">
        {/* Global Loading or Error Boundary could go here */}
        {children}
      </body>
    </html>
  )
}