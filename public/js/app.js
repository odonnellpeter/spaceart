var scene ={};


angular.module("artApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "art.html",
                controller: "ArtController",
                resolve: {
                    art: function(Art) {
                        return Art.getArt();
                    }
                }
            })
    })
    .service("Art", function($http) {
        this.getArt = function() {
            return $http.get("/art").
            then(function(response) {
                return response;
            }, function(response) {
                alert("Error finding art.");
            });
        }
    })
    .controller("ArtController", function(art, $scope) {


        var canvas = document.getElementById("myCanvas");
        var seed = getRandomSeed();

        //var scene = {};
        scene.seed = seed;
        scene.context = canvas.getContext("2d");
        scene.context.fillStyle = 'black';
        scene.width = canvas.width;
        scene.height = canvas.height;

        scene.context.fillRect(0,0,scene.width, scene.height);

        //noise.seed(scene.seed % 10000);

        scene.imageData = scene.context.getImageData(0,0, scene.width, scene.height);
        scene.buffer = scene.imageData.data;

        scene.context.putImageData(scene.imageData, 0, 0);

        scene.skyColor = getFloat(scene.seed, getPivot('skyColor'));
        scene.skyColor2 = getFloat(scene.seed, getPivot('skyColor')) * 0.16;


        scene.skysat = getFloat(scene.seed, getPivot('skysat'), 0.7,0.9);
        scene.skyvalue1 = getFloat(scene.seed, getPivot('skyvalue1'), 0.6, 0.85);

        for (var x = 0; x < scene.width; x++) {
            for (var y = 0; y < scene.height; y++) {
                //y+300 removes from darkness from the top of the picture
                ry = (y + 300) / scene.height;

                //these will put variance into the gradient

                //ry = ry + getFloat(scene.seed, 1000000 + x * y + x + y);
                //ry = ry + getFloat(scene.seed, 1000000 + y * y);
                setPixel(x,y,getRGB((scene.skyColor * ry + (1 - ry) * (scene.skyColor + scene.skyColor2)) , scene.skysat, scene.skyvalue1 * ry + (1 - ry) * scene.skyColor2));
            }
        }



        drawBrightStars();

        drawStars();

        drawVeryBrightStar();

        drawSun();

        drawShips();

        scene.context.putImageData(scene.imageData, 0, 0);

        $scope.art = "yo";
    });

function getRandomSeed() {
    var seed = Math.round(Math.random() * 9007199254740991);
    return seed;
}

function getPivot(text){
    var myrng = new Math.seedrandom(text);
    var roundedNumber = Math.round(myrng() * 100000000);
    return roundedNumber;

}

function getRGB(h, s, v) {
    while (h > 1) h -= 1;
    while (h < 0) h += 1;

    var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}

function getFloat(seed, pivot, from, to) {
    if (!from)
        from = 0;
    if (!to)
        to = 1;

    var x = ((seed % pivot) % 100000) / 100000;
    return from + (to - from) * x;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getInt(seed, max, pivot) {
    return (seed % pivot) % max;
}

function setPixel(x, y, color, alpha) {


    if(x===0 && y === 0){
        console.log("colors " +  color.r + " " + color.g + " " + color.b);
    }


    setPixelRGB(x,y,color.r, color.g, color.b, alpha);
}

function setPixelRGB(x, y, r, g, b, alpha) {

    if (x >= scene.width || y >= scene.height || x < 0 || y < 0)
        return;
    x = Math.floor(x);
    y = Math.floor(y);
    if (alpha === undefined)
        alpha = 1;
    if (alpha <= 0)
        return;
    if (alpha > 1)
        alpha = 1;

    if (alpha == 1) {
        scene.buffer[(y * scene.width + x) * 4 + 0] = r;
        scene.buffer[(y * scene.width + x) * 4 + 1] = g;
        scene.buffer[(y * scene.width + x) * 4 + 2] = b;
    } else {
        scene.buffer[(y * scene.width + x) * 4 + 0] = Math.floor((1 - alpha) * scene.buffer[(y * scene.width + x) * 4 + 0] + alpha * r);
        scene.buffer[(y * scene.width + x) * 4 + 1] = Math.floor((1 - alpha) * scene.buffer[(y * scene.width + x) * 4 + 1] + alpha * g);
        scene.buffer[(y * scene.width + x) * 4 + 2] = Math.floor((1 - alpha) * scene.buffer[(y * scene.width + x) * 4 + 2] + alpha * b);
    }
}


function drawSun(){

    var sunColor = scene.skyColor - .2;
    if(sunColor <=0){
        sunColor += 1;
    }

    applyBuffer();
    console.log("sun");
    var centerX = getRandomInt(0, scene.width);
    var centerY = getRandomInt(0, scene.height);
    var radius = getRandomInt(50 , 200);
    scene.context.fillStyle = "rgba(255,255,255,.2)"
        //"rgba(255,255,255,.2)";
    scene.context.beginPath();
    scene.context.arc(centerX, centerY, (radius * 1.05) , 0, 2 * Math.PI, false);
    scene.context.fill();

    scene.context.fillStyle = getColorString(getRGB(sunColor, 0.3, 1));
    scene.context.beginPath();
    scene.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    scene.context.fill();

    setupBuffer();

}

function getColorString(color, alpha) {
    if (alpha === undefined)
        alpha = 1;
    return 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + alpha + ')';
}

function setupBuffer() {
    scene.imageData = scene.context.getImageData(0,0, scene.width, scene.height);
    scene.buffer = scene.imageData.data;
}

function applyBuffer() {
    scene.context.putImageData(scene.imageData, 0, 0);
}


function drawStars(){
    scene.numberOfStars = getRandomInt(20, 100);
    for(var x = 0; x < scene.numberOfStars; x++){
        var starX = getRandomInt(0, scene.width);
        var starY = getRandomInt(0, scene.height);
        setPixelRGB(starX, starY, 256, 256, 256, 1);
        setPixelRGB(starX, starY-1, 256, 256, 256, 1);
        setPixelRGB(starX-1, starY, 256, 256, 256, 1);
        setPixelRGB(starX+1, starY, 256, 256, 256, 1);
        setPixelRGB(starX, starY+1, 256, 256, 256, 1);
    }
}

function drawBrightStars(){


    scene.numberOfStars = getRandomInt(5, 10);
    for(var x = 0; x < scene.numberOfStars; x++){
        var starX = getRandomInt(0, scene.width);
        var starY = getRandomInt(0, scene.height);

        //Bright starts should be 10 across and 10 up intersecting at the starX and starY.
        //then fill in a a squar 3X3 around the middle


        for(var y = 0; y < 5; y++){
            drawWhiteDot(starX + y, starY, 256, 256, 256, 1);
            drawWhiteDot(starX - y, starY , 256, 256, 256, 1);
        }
        for( var z = 0; z < 5; z++){
            drawWhiteDot(starX, starY - z, 256, 256, 256, 1);
            drawWhiteDot(starX, starY + z, 256, 256, 256, 1);
        }
        for( var i = 0; i < 2; i++){
                drawWhiteDot(starX + i, starY + i, 256, 256, 256, 1);
                drawWhiteDot(starX - i, starY + i, 256, 256, 256, 1);
                drawWhiteDot(starX + i, starY - i, 256, 256, 256, 1);
                drawWhiteDot(starX - i, starY - i, 256, 256, 256, 1);
        }
    }
}

function drawVeryBrightStar(){

    var starX = getRandomInt(0, scene.width);
    var starY = getRandomInt(0, scene.height);


    for(var y = 0; y < 15; y++){
        drawWhiteDot(starX + y, starY, 256, 256, 256, .2);
        drawWhiteDot(starX - y, starY, 256, 256, 256, .2);
    }
    for( var z = 0; z < 15; z++){
        drawWhiteDot(starX, starY - z, 256, 256, 256, .2);
        drawWhiteDot(starX, starY + z, 256, 256, 256, .2);
    }

    for( var i = 0; i < 7; i++){
        for( var j = 0; j < 7; j++) {
            if( i + j < 7) {
                drawWhiteDot(starX + i, starY + j, 256, 256, 256, .5);
                drawWhiteDot(starX - i, starY + j, 256, 256, 256, .5);
                drawWhiteDot(starX + i, starY - j, 256, 256, 256, .5);
                drawWhiteDot(starX - i, starY - j, 256, 256, 256, .5);
            }
        }
    }


}


function drawWhiteDot(x, y){
    setPixelRGB(x, y, 256, 256, 256, 1);
}



function drawShips(){


    scene.numberOfShips = getRandomInt(0, 7);
    //scene.lengthOfShips = 20;
    //scene.heightOfShips = scene.lengthOfShips;
    scene.face = true;
    scene.size = getInt(scene.seed, 20, getPivot('starshipsize')) + 10;
    scene.exhausthue = scene.skyColor + 0.5;
    if (scene.exhausthue > 1)
        scene.exhausthue -= 1;

    scene.spacing = getRandomInt(scene.size, scene.size * 2);

    console.log("spacing " + scene.spacing);

    console.log("scene size " + scene.size);
    console.log("scene seed " + scene.seed);

    console.log("pivot exhaust " + getPivot('exhaustlength'));

    console.log("get int " + getInt(scene.seed, 9, getPivot('exhaustlength')));


    scene.exhaustlength = (3 + getInt(scene.seed, 9, getPivot('exhaustlength'))) * scene.size;
    scene.shipOrientation = getRandomInt(0, 3);

    scene.exhaustwidth = scene.size / 6 ;

    //scene.shipOrientation = 3;
    //console.log(scene.shipOrientation);

    scene.shipPositionX = getRandomInt(200, 1080);
    scene.shipPositionY = getRandomInt(200, 520);

    for(var x = 0; x < scene.numberOfShips; x++ ){
        for(var length = 0; length < scene.size; length++){
            for(var height = 0; height < scene.size; height++) {

                var yoffset = 0;
                var xoffset = 0;

                if (x === 0) {
                    xoffset = 0;
                    yoffset = 0;
                } else if (x % 2 === 0) {
                    xoffset = (scene.spacing * x);
                    yoffset = xoffset;
                } else {
                    xoffset = scene.spacing * (x + 1 );
                    yoffset = -1 * xoffset;
                }

                if (scene.shipOrientation === 0) {

                    if ((length + (scene.size - height) > scene.size)) {
                        if (x === 0) {
                            setPixelRGB((scene.shipPositionX + length + xoffset), (scene.shipPositionY + height + yoffset), 256, 256, 256, 1);
                            setPixelRGB((scene.shipPositionX + length + xoffset), (scene.shipPositionY - height + yoffset), 256, 256, 256, 1);
                        } else {
                            setPixelRGB((scene.shipPositionX + length + xoffset), (scene.shipPositionY + height + yoffset), 0, 0, 0, 1);
                            setPixelRGB((scene.shipPositionX + length + xoffset), (scene.shipPositionY - height + yoffset), 0, 0, 0, 1);
                        }

                        if(length > (scene.size / 2)){
                            for(var t = 0; t < (length - (scene.size / 2)) ; t ++) {

                                if (x === 0) {

                                    setPixelRGB((scene.shipPositionX + length + xoffset), (scene.shipPositionY + height + t + yoffset), 256, 256, 256, 1);
                                    setPixelRGB((scene.shipPositionX + length + xoffset), (scene.shipPositionY - height - t + yoffset), 256, 256, 256, 1)
                                } else {
                                    setPixelRGB((scene.shipPositionX + length + xoffset), (scene.shipPositionY + height + t + yoffset), 0, 0, 0, 1);
                                    setPixelRGB((scene.shipPositionX + length + xoffset), (scene.shipPositionY - height - t + yoffset), 0, 0, 0, 1);
                                }
                            }
                        }

                    }

                } else if (scene.shipOrientation === 1) {
                    xoffset *= -1;
                    if (length + (scene.size - height) > scene.size) {
                        if (x === 0) {
                            setPixelRGB((scene.shipPositionX - length), (scene.shipPositionY + height), 256, 256, 256, 1);
                            setPixelRGB((scene.shipPositionX - length), (scene.shipPositionY - height), 256, 256, 256, 1);
                        } else {
                            setPixelRGB((scene.shipPositionX - length + xoffset), (scene.shipPositionY + height + yoffset), 0, 0, 0, 1);
                            setPixelRGB((scene.shipPositionX - length + xoffset), (scene.shipPositionY - height + yoffset), 0, 0, 0, 1);
                        }

                        if(length > (scene.size / 2)){
                            for(var t = 0; t < (length - (scene.size / 2)) ; t ++) {
                                if (x === 0) {
                                    setPixelRGB((scene.shipPositionX - length + xoffset), (scene.shipPositionY + height + t + yoffset), 256, 256, 256, 1);
                                    setPixelRGB((scene.shipPositionX - length + xoffset), (scene.shipPositionY - height - t + yoffset), 256, 256, 256, 1)
                                } else {
                                    setPixelRGB((scene.shipPositionX - length + xoffset), (scene.shipPositionY + height + t + yoffset), 0, 0, 0, 1);
                                    setPixelRGB((scene.shipPositionX - length + xoffset), (scene.shipPositionY - height - t + yoffset), 0, 0, 0, 1);
                                }
                            }
                        }
                    }


                }
                else if (scene.shipOrientation === 2) {
                    if(yoffset < 0 ){
                        yoffset *= -1;
                    }
                    if (x % 2 === 0) {
                        xoffset = -(scene.spacing * x);
                    }
                    if (height + (scene.size - length) > scene.size) {
                        if (x === 0) {
                            setPixelRGB((scene.shipPositionX + length ), (scene.shipPositionY + height ), 256, 256, 256, 1);
                            setPixelRGB((scene.shipPositionX - length ), (scene.shipPositionY + height ), 256, 256, 256, 1);
                        } else {
                            setPixelRGB((scene.shipPositionX + length + xoffset), (scene.shipPositionY + height + yoffset), 0, 0, 0, 1);
                            setPixelRGB((scene.shipPositionX - length + xoffset), (scene.shipPositionY + height + yoffset), 0, 0, 0, 1);
                        }

                        if(height > (scene.size / 2)){
                            for(var t = 0; t < (height - (scene.size / 2)) ; t ++) {

                                if (x === 0) {

                                    setPixelRGB((scene.shipPositionX + length + t + xoffset), (scene.shipPositionY + height + yoffset), 256, 256, 256, 1);
                                    setPixelRGB((scene.shipPositionX - length - t + xoffset), (scene.shipPositionY + height + yoffset), 256, 256, 256, 1)
                                } else {
                                    setPixelRGB((scene.shipPositionX + length + t + xoffset), (scene.shipPositionY + height + yoffset), 0, 0, 0, 1);
                                    setPixelRGB((scene.shipPositionX - length - t + xoffset), (scene.shipPositionY + height + yoffset), 0, 0, 0, 1);
                                }
                            }
                        }
                    }

                }
                else if (scene.shipOrientation === 3) {
                    if(yoffset > 0 ){
                        yoffset *= -1;
                    }
                    if (x % 2 === 0) {
                        xoffset = -(scene.spacing * x);
                    }


                    if (height + (scene.size - length) > scene.size) {
                        if (x === 0) {
                            setPixelRGB((scene.shipPositionX + length ), (scene.shipPositionY - height ), 256, 256, 256, 1);
                            setPixelRGB((scene.shipPositionX - length ), (scene.shipPositionY - height ), 256, 256, 256, 1);
                        } else {
                            setPixelRGB((scene.shipPositionX + length + xoffset), (scene.shipPositionY - height + yoffset), 0, 0, 0, 1);
                            setPixelRGB((scene.shipPositionX - length + xoffset), (scene.shipPositionY - height + yoffset), 0, 0, 0, 1);
                        }

                        if(height > (scene.size / 2)){
                            for(var t = 0; t < (height - (scene.size / 2)) ; t ++) {

                                if (x === 0) {

                                    setPixelRGB((scene.shipPositionX + length + t + xoffset), (scene.shipPositionY - height + yoffset), 256, 256, 256, 1);
                                    setPixelRGB((scene.shipPositionX - length - t + xoffset), (scene.shipPositionY - height + yoffset), 256, 256, 256, 1)
                                } else {
                                    setPixelRGB((scene.shipPositionX + length + t + xoffset), (scene.shipPositionY - height + yoffset), 0, 0, 0, 1);
                                    setPixelRGB((scene.shipPositionX - length - t + xoffset), (scene.shipPositionY - height + yoffset), 0, 0, 0, 1);
                                }
                            }
                        }
                    }

                }




            }
        }

        for(var exhaustLength = 0; exhaustLength <= scene.exhaustlength; exhaustLength ++){

            for(var exhaustHeight = 0; exhaustHeight < 3; exhaustHeight++) {
                var yoffset = 0;
                var xoffset = 0;

                if(x===0){
                    xoffset = 0;
                    yoffset = 0;
                }else if (x % 2 === 0 ){
                    xoffset = (scene.spacing * x);
                    yoffset = xoffset;
                }else{
                    xoffset = scene.spacing * (x + 1 );
                    yoffset = -1 * xoffset;
                }
                var offsetForMiddleHeightIfOddsize = 0;
                if(scene.size % 2 !=0){
                    offsetForMiddleHeightIfOddsize = (scene.size / 2) - 1;
                }else{
                    offsetForMiddleHeightIfOddsize = scene.size / 2;
                }




                if (scene.shipOrientation === 0) {
                    var middleheight = (scene.shipPositionY + -(offsetForMiddleHeightIfOddsize) + yoffset);

                    setPixel((scene.shipPositionX + exhaustLength + scene.size + xoffset), middleheight, getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));
                    setPixel((scene.shipPositionX + exhaustLength + scene.size + xoffset), middleheight + scene.size, getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));

                    for( var w = 1; w <= scene.exhaustwidth; w++){

                        setPixel((scene.shipPositionX + exhaustLength + scene.size + xoffset), middleheight - w, getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));
                        setPixel((scene.shipPositionX + exhaustLength + scene.size + xoffset), middleheight - w + scene.size, getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));

                        setPixel((scene.shipPositionX + exhaustLength + scene.size + xoffset), middleheight + w, getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));
                        setPixel((scene.shipPositionX + exhaustLength + scene.size + xoffset), middleheight + w + scene.size, getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));

                    }


                } else if (scene.shipOrientation === 1) {
                    var middleheight = (scene.shipPositionY + -(offsetForMiddleHeightIfOddsize) + yoffset);
                    xoffset *= -1;

                    setPixel((scene.shipPositionX - exhaustLength - scene.size + xoffset), middleheight, getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));
                    setPixel((scene.shipPositionX - exhaustLength - scene.size + xoffset), middleheight + scene.size, getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));

                    for( var w = 1; w <= scene.exhaustwidth; w++) {

                        setPixel((scene.shipPositionX - exhaustLength - scene.size + xoffset), middleheight - w, getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));
                        setPixel((scene.shipPositionX - exhaustLength - scene.size + xoffset), middleheight + scene.size - w, getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));

                        setPixel((scene.shipPositionX - exhaustLength - scene.size + xoffset), middleheight + w, getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));
                        setPixel((scene.shipPositionX - exhaustLength - scene.size + xoffset), middleheight + scene.size + w, getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));

                    }

                }
                else if (scene.shipOrientation === 2) {

                    if(yoffset < 0 ){
                        yoffset *= -1;
                    }
                    if (x % 2 === 0) {
                        xoffset = -(scene.spacing * x);
                    }

                    var middleheight = (scene.shipPositionX + -(offsetForMiddleHeightIfOddsize) + xoffset);

                    setPixel(middleheight, (scene.shipPositionY + scene.size + exhaustLength + yoffset),getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));
                    setPixel(middleheight + scene.size, (scene.shipPositionY  + scene.size + exhaustLength + yoffset),getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));

                    for( var w = 1; w <= scene.exhaustwidth; w++) {
                        setPixel(middleheight + w, (scene.shipPositionY + scene.size + exhaustLength + yoffset), getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));
                        setPixel(middleheight + scene.size + w, (scene.shipPositionY + scene.size + exhaustLength + yoffset), getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));

                        setPixel(middleheight - w, (scene.shipPositionY + scene.size + exhaustLength + yoffset), getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));
                        setPixel(middleheight + scene.size - w, (scene.shipPositionY + scene.size + exhaustLength + yoffset), getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));
                    }
                }
                else if (scene.shipOrientation === 3) {

                    if(yoffset > 0 ){
                        yoffset *= -1;
                    }
                    if (x % 2 === 0) {
                        xoffset = -(scene.spacing * x);
                    }
                    var middleheight = (scene.shipPositionX + -(offsetForMiddleHeightIfOddsize) + xoffset);

                    setPixel(middleheight, (scene.shipPositionY - scene.size - exhaustLength + yoffset),getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));
                    setPixel(middleheight + scene.size, (scene.shipPositionY  - scene.size - exhaustLength + yoffset),getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));

                    for( var w = 1; w <= scene.exhaustwidth; w++) {

                        setPixel(middleheight + w, (scene.shipPositionY - scene.size - exhaustLength + yoffset), getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));
                        setPixel(middleheight + scene.size + w, (scene.shipPositionY - scene.size - exhaustLength + yoffset), getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));

                        setPixel(middleheight - w, (scene.shipPositionY - scene.size - exhaustLength + yoffset), getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));
                        setPixel(middleheight + scene.size - w, (scene.shipPositionY - scene.size - exhaustLength + yoffset), getRGB(scene.exhausthue, 1, 1), Math.pow(1.0 - (exhaustLength / scene.exhaustlength), 2.0));
                    }
                }
            }
        }
    }
}