import * as https from "node:https";
import * as perf_hooks from "node:perf_hooks";

const perfObserver = new PerformanceObserver((items) => {
    items.getEntries().forEach((entry) => {
        console.log(`${entry.name} : ${entry.duration.toFixed(1)}ms`);
    })
})

perfObserver.observe({ entryTypes : ["measure"]})

export function getInfo(url : string){
    const startTotal = performance.now();
    let connectionStart : any, connectionEnd : any, tlsStart : any, tlsEnd : any, dataStart : any, dataEnd;

    return new Promise((resolve, reject) => {
        connectionStart = performance.now();

        const req = https.request(url, (res) => {
            connectionEnd = performance.now();
            performance.measure('Connection', { start: connectionStart, end: connectionEnd });

            if (url.startsWith('https')) {
                // TLS handshake is included in connection time for HTTPS
                tlsStart = connectionStart;
                tlsEnd = connectionEnd;
                performance.measure('TLS handshake', { start: tlsStart, end: tlsEnd });
            }

            dataStart = performance.now();
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                dataEnd = performance.now();
                performance.measure('Data transfer', { start: dataStart, end: dataEnd });

                const endTotal = performance.now();
                performance.measure('Total', { start: startTotal, end: endTotal });

                resolve({
                    total: endTotal - startTotal,
                    connection: connectionEnd - connectionStart,
                    tls: url.startsWith('https') ? (tlsEnd - tlsStart) : 0,
                    dataTransfer: dataEnd - dataStart
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });

}

export async function checker (url : string){
    try {
        const metrics : any = await getInfo(url);
        const response = await fetch(url);
        const status = await response.status;
        const connection : number =  parseInt(metrics.connection.toFixed(1))
        const TLShandshake : number = parseInt(metrics.tls.toFixed(1));
        const dataTransfer : number = parseInt(metrics.dataTransfer.toFixed(1));
        const total = connection + TLShandshake + dataTransfer

        return {
            total,
            connection,
            TLShandshake,
            dataTransfer,
            status
        }
    }catch(error){
        console.error('Error:', error);
        return {
            total  : 0,
            connection : 0,
            TLShandshake : 0,
            dataTransfer : 0,
            status : 500,
        }
    }
}