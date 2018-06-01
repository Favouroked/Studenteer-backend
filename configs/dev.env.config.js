let express = require('express');
let app = express();
if(app.get('env') === 'development') {
    module.exports = true;
}
else{
    module.exports = false;
}