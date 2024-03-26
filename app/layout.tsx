export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang='en'>
        <head>
          <title>Empréstimo do Caixa Tem</title>
          <meta property='og:title' content='TEM Empréstimos' />
          <meta property='og:description' content='O Caixa Tem irá disponibilizar empréstimos aos seus usuários. Essa novidade é uma forma de ampliar as opções de acesso ao crédito para aqueles que precisam de recursos financeiros extras.' />
          <meta property='og:image' content='https://i.imgur.com/w17rw8A.jpeg' />
        </head>
        <body>{children}</body>
      </html>
    )
  }
  
