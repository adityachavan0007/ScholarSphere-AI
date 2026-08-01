export async function validateLinks(opportunities: any[]) {
    return await Promise.all(opportunities.map(async (opp) => {
        if (!opp.link || opp.link === '#' || !opp.link.startsWith('http')) {
            return { ...opp, link_verified: false };
        }
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            
            const res = await fetch(opp.link, { 
                method: 'HEAD', 
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            clearTimeout(timeoutId);
            
            // Accept 200s, 300s, and even 403s (since some block HEAD/bots but the link is technically alive)
            const isAlive = res.ok || res.status < 400 || res.status === 403;
            return { ...opp, link_verified: isAlive };
        } catch {
            return { ...opp, link_verified: false };
        }
    }));
}
