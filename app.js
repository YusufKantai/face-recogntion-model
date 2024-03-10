var security = 97
var wrong = 1
var img = document.getElementById("img")
var vid = document.getElementById("vid")
var screen = document.getElementById("text")
var detector
var estimationConfig 
var control = 1
var img2 = []
var img1 = []
var indicator = document.getElementById("indicator")

async function get(){
  await navigator.mediaDevices.getUserMedia({video:true}).then((function(stream){
    vid.srcObject=stream
    screen.innerHTML = ""
    mode()
  }))
}
get()

//load the face mesh model [468 points]
 async function mode(){
  screen.innerHTML = "loading..."
  control=2
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
const detectorConfig = {
  runtime: 'mediapipe',
  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh'
};
  detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
 estimationConfig = {flipHorizontal: false};
array2()


}
async function array1(){
  
  var vid = document.getElementById("vid");
  const faces = await detector.estimateFaces(vid, estimationConfig);
  console.log(faces)
  if(faces.length==0){
    control = 1
    screen.innerHTML = "********"
  }
  
  //get the magnitude of the face in the video object and store it in an array [0 - 233]
  var a = 0
  var x = 0
  while(a<468){
    var b = a+1
    var x1 =  faces[0].keypoints[a].x 
    var x2 =  faces[0].keypoints[b].x 
    var y1 =  faces[0].keypoints[a].y
    var y2 =  faces[0].keypoints[b].y

    var partA = (x1-x2)*(x1-x2)
    var partB = (y1-y2)*(y1-y2)
    var mag = Math.sqrt(partA+partB)   
    img1[x]=mag

    if(a==466){
      console.log(img1.length + " image 1")
      recognize(img1,img2)
    }

    a=a+2
    x++
  }
}

async function array2(){ 
  var image = document.getElementById("img");
  const face = await detector.estimateFaces(image, estimationConfig);
  if(face.length==0){
    control = 1
    screen.innerHTML = "scanning..."
  }
    //get the magnitude of the face in the image object and store it in an array
    var A = 0
    var X = 0
    while(A<468){
      var B = A+1
      var x11 =  face[0].keypoints[A].x 
      var x22 =  face[0].keypoints[B].x 
      var y11 =  face[0].keypoints[A].y
      var y22 =  face[0].keypoints[B].y
  
      var partAA = (x11-x22)*(x11-x22)
      var partBB = (y11-y22)*(y11-y22)
      var magg = Math.sqrt(partAA+partBB)
      img2[X]=magg
      
      if(A==466){
        console.log(img2.length + " image 2")
        array1()
        vid.style.filter = "blur(0px)"
      }
  
      A=A+2
      X++
    }
}

//find the common ratio of each image
function recognize(img1,img2){
  //common ratio for image one
  // alert(img1.length +" "+ img2.length)
  var CR1 = []
  var loop = 0
  while(loop < 233){
    var loop2 = loop + 1
    var p1 = img1[loop]
    var p2 = img1[loop2]
    var crr = p1 / p2
    CR1[loop] = crr
    if(loop==232){
      loop=234
      
    }
    loop++
  }
//common ratio for image 2
  var CR2 = []
  var loops = 0
   
  while(loops < 233){
    var loops2 = loops + 1
    var pp1 = img2[loops]
    var pp2 = img2[loops2]
    var crrr = pp1 / pp2
    CR2[loops] = crrr
    
    if(loops==232){
      loops=234
    }
    loops++
  }
// determine the bigger face
var looping = 0 
var size1 = 0
var size2 = 0
while(looping<233){
  size1 += CR1[looping]
  size2 += CR2[looping]
  looping++
}

//check the large and small face and process the fraction
if(size1>size2){  
  var looop = 0
  var totalCR = 0
  while(looop<233){
    totalCR += CR2[looop] / CR1[looop]
    looop++
  }
}else{
  var looop = 0
  var totalCR = 0
  while(looop<233){
    totalCR += CR1[looop] / CR2[looop]
    looop++
  }
}
//find the percentage match
var percentage = Math.floor((totalCR/233)*100)
if(percentage>100){
  percentage = 100-(percentage-100)
}
//this is where you change
if(percentage>=security){
  if(wrong==3){
    screen.style.color = "green"
  indicator.style.backgroundColor = "green"
  screen.innerHTML =  "user verified" 
  window.location.href="unlock.html";
  console.log(percentage) 
  }
  wrong += 1
}else{
  screen.style.color = "red"
  screen.innerHTML = "wrong user"
  console.log(percentage) 
  wrong += 1
}
control = 1
}
function constr(){
if(control==1){
  array2()
}
}
setInterval(constr,1000)