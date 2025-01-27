import os from 'os';
import macaddress from 'node-macaddress';
const getAllInfo = async(req,res) =>{
    const hostname = os.hostname();
    const macs = await macaddress.all();
    if (!macs || Object.keys(macs).length === 0) {
        return res.status(500).json({ error: 'No MAC address found' });
    }
    return  res.json({
        message: 'System info fetched successfully',
        hostname: hostname,
        macAddresses: macs
    });
}
export default getAllInfo