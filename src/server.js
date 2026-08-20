import app from './app.js';


async function startServer() {
    try{
    const PORT=3000;
    const server=app.listen(PORT,()=>{
        console.log(`API GATEWAY is running on port ${PORT}`);
    });
    const handleShutdown=async(signal)=>{
        console.log('Shutting down API Gateway...');
        server.close(async ()=>{
            console.log('API Gateway has been shut down.');
            process.exit(0);
        });
    };
    // //Forcefully shutdown the server on termination signals
    // setTimeout(()=>{
    //     console.error('Forcefully shutting down API Gateway...');
    //     process.exit(1);
    // },10000);


    // // Handle termination signals for graceful shutdown
    // process.on('SIGINT',() => handleShutdown('SIGINT'));
    // process.on('SIGTERM', () => handleShutdown('SIGTERM'));
}
catch (error) {
    console.error('Failed to start API Gateway:', error);
    process.exit(1);
}
}
startServer();