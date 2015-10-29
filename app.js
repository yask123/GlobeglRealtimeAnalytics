var div = document.getElementById('globe');
var urls = {
  earth: 'img/world.jpg',
  bump: 'img/bump.jpg',
  specular: 'img/specular.jpg',
}

// create a globe
var globe = new Globe(div, urls);

// start it
globe.init();

var appbase = new Appbase({
  url: 'https://scalr.api.appbase.io',
  appname: 'aSAsaSas',
  username: 'oN9gvXDTd',
  password: '8f013b31-5e69-4c77-a540-87540e69e3a8'
});

var jsonObject = {
  "latitude":0,
  "longitude":0,
  "country":0,
  "time":0,
  "isp":0,
  "h":0,
  "m":0,
  "s":0
}
appbase.searchStream({
  type: 'people71',
  body: {
   "from" : 0, "size" : 1000,
   query: {
    match_all: {}
  }
}
}).on('data', function(response) {
  console.log('test');
  if (response.hits){
    console.log(response.hits.hits.length);
    var l = response.hits.hits.length;

    for(var i=0;i<l;i++)
    {
      var time = response.hits.hits[i]._source.h+":"+response.hits.hits[i]._source.m+":"+response.hits.hits[i]._source.s;
      var log = "<p>New User arrived: </p><p> Time: "+time+" </p><p> Country:"+response.hits.hits[i]._source.country+" </p><p> longitude:"+response.hits.hits[i]._source.longitude+" </p><p> Latitude:" +response.hits.hits[i]._source.latitude+"</p><p> ISP :"+response.hits.hits[i]._source.isp+" </p>---------------------------------------------------";
      $('#logs').prepend(log); 
      var data = {
        color: '#2962FF',
        lat: response.hits.hits[i]._source.latitude,
        lon: response.hits.hits[i]._source.longitude,
        size: 5
      };
      globe.addLevitatingBlock(data);
    }
    globe.center(data);

    console.log(response.hits.hits);
  }
  else
  {
    console.log("New user");
    document.getElementById('cont').innerHTML = response._source.country;
    $('.error').fadeIn(400).delay(3000).fadeOut(400);

    console.log(response._source);
     var time = response._source.h+":"+response._source.m+":"+response._source.s;
      var log = "<p>New User arrived: </p><p> Time: "+time+" </p><p> Country:"+response._source.country+" </p><p> longitude:"+response._source.longitude+" </p><p> Latitude:" +response._source.latitude+"</p><p> ISP :"+response._source.isp+" </p>---------------------------------------------------";
      $('#logs').prepend(log); 
    var data = {
            color: '#2962FF',
            size: Math.random() * 100,
            lat: parseInt(response._source.latitude),
            lon: parseInt(response._source.longitude),
            size: 5
          };
    globe.addLevitatingBlock(data);
    globe.center(data);
  }
}).on('error', function(error) {
  console.log("caught a stream error", error)
})

$.ajax({
  url : 'http://www.telize.com/geoip',
  type: 'GET',
  success : handleData
});
function handleData(data)
{
  document.getElementById('cont').innerHTML = data.country;
  $('.error').fadeIn(400).delay(3000).fadeOut(400);
  jsonObject.latitude=data.latitude;
  jsonObject.longitude=data.longitude;
  jsonObject.country=data.country;
  jsonObject.isp=data.isp;

  var d = new Date(); // for now
  jsonObject.h =  d.getHours(); // => 9
  jsonObject.m =  d.getMinutes(); // =>  30
  jsonObject.s =  d.getSeconds(); // => 51

  var time = jsonObject.h+":"+jsonObject.m+":"+jsonObject.s;
  var log = "<p> Time: "+time+" </p><p> Country:"+jsonObject.country+" </p><p> longitude:"+jsonObject.longitude+" </p><p> Latitude:" +jsonObject.latitude+"</p><p> ISP :"+jsonObject.isp+" </p>---------------------------------------------------";
  $('#current').prepend(log); 

  appbase.index({
    type: 'people71',
    body: jsonObject
  }).on('data', function(response) {
    console.log(response);
  }).on('error', function(error) {
    console.log(error);
  });
}

