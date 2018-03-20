if(process.env.NODE_ENV === "production"){
  return module.exports = {
    MONGODB_URI: "mongodb://Samuel:newPass11@ds117729.mlab.com:17729/vidjot-prod",
    output: "Connected To Production MongoDB Database Server"
  }
}

module.exports = {
  MONGODB_URI: "mongodb://localhost:27017/vidjot-dev",
  output: "Connected To Local MongoDB Database Server"
}