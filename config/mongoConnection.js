const { MongoClient } = require('mongodb')
// const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://ReadWriteUser:7nyZXjQuT1frKWqF@cluster0.lvc3v.mongodb.net/GymStar?retryWrites=true&w=majority"
// const client = new MongoClient(uri)
let client = undefined
let db = undefined
async function main(){
  
  try{
    await client.connect()
    console.log('Database Connected successfully')
  }catch(e){
    console.log(`Error : ${e}`)
  }finally{
    await client.close()
  }

}
// main().catch(console.error)
module.exports = {
    connectToDb: async () => {
        if( ! client ){
            try{
                client = await MongoClient.connect(uri)
                db = await client.db('GymStar')
            }catch(e){
                console.log(`Error : ${e}`)
            }
            
        }
        return db
    },
    closeConnection: () => {
        client.close()
    }
}