export default function handler(req, res) {
    // Configuração de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Tratamento de preflight OPTIONS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Roteamento baseado no path
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    
    switch (pathname) {
        case '/':
            res.status(200).json({ 
                message: 'API is running on Vercel!',
                timestamp: new Date().toISOString(),
                path: pathname
            });
            break;
            
        case '/health':
            res.status(200).json({ 
                status: 'OK', 
                timestamp: new Date().toISOString(),
                path: pathname
            });
            break;
            
        default:
            res.status(404).json({ 
                error: 'Route not found', 
                path: pathname,
                availableRoutes: ['/', '/health']
            });
            break;
    }
}
