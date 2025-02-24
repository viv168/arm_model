export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>3D Arm Simulation</title>
      </head>
      <body className="bg-gray-200">{children}</body>
    </html>
  )
}
