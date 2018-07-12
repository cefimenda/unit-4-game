
$(function(){
    devil.create(300,600);
    knight.create(300,450);
    spider.create(200,400);
});

var game = {

}

function Hero(id,hp,maxStamina,attacks,staminaLoadSpeed){
    this.id=id;
    this.create = function(top,left){
        var img = $("<img>")
        img.attr("src","assets/images/sprites/"+this.img)
        img.attr("id",this.id)
        img.css({
            "position":"fixed",
            "top":top+"px",
            "left":left+"px"
        })
        $("body").append(img)
    };
    this.update = function(){
        var img = $("#"+this.id)
        img.attr("src","assets/images/sprites/"+this.img)
    },
    this.img= this.id+"_fr1.gif"
    this.hp=hp;
    this.maxStamina=maxStamina;
    this.stamina=maxStamina;
    this.attacks=attacks;
    this.staminaLoadSpeed=staminaLoadSpeed
    this.staminaLoad = function(){
        while(this.maxStamina>this.stamina){
            this.stamina+=this.staminaLoadSpeed;
            setTimeout(this.staminaLoad,1000)
        }
    };
    this.move = function(direction){
        var charIcon = $("#"+this.id)
        var topPos = Number(charIcon.css("top").split("px")[0])
        var leftPos = Number(charIcon.css("left").split("px")[0])
        
        var compIcon = $("#"+comp.id)
        var compTopPos = Number(compIcon.css("top").split("px")[0])
        var compLeftPos = Number(compIcon.css("left").split("px")[0])
        
        changePosition(charIcon,direction,topPos,leftPos)

        if (this.img.search(direction+"1")>-1){
            this.img = this.id+"_"+direction+"2.gif";
        }
        else{
            this.img=this.id+"_"+direction+"1.gif";
        }


        
        this.update()
    }
}

function Villain(id,hp,counter){
    this.id=id;
    this.update = function(){
        var img = $("#"+this.id)
        img.attr("src","assets/images/sprites/"+this.img)
    };
    this.img= this.id+"_fr1.gif";
    this.hp=hp;
    this.counter=counter;
    this.create = function(top,left){
        var img = $("<img>")
        img.attr("src","assets/images/sprites/"+this.img)
        img.attr("id",this.id)
        img.css({
            "position":"fixed",
            "top":top+"px",
            "left":left+"px"
        })
        $("body").append(img)
    };
    this.move=function(){
        var charIcon = $("#"+player.id)
        var topPos = Number(charIcon.css("top").split("px")[0])
        var leftPos = Number(charIcon.css("left").split("px")[0])
        
        var compIcon = $("#"+this.id)
        var compTopPos = Number(compIcon.css("top").split("px")[0])
        var compLeftPos = Number(compIcon.css("left").split("px")[0])
        //villain always looks towards the player
        if (0<compTopPos-topPos && compTopPos-topPos<80 && (compLeftPos-leftPos)**2<(-30)**2){
            this.img = this.id+"_bk1.gif"
        }
        if (0>compTopPos-topPos && compTopPos-topPos>-80 && (compLeftPos-leftPos)**2<(-30)**2){
            this.img = this.id+"_fr1.gif"
        }
        if (0<compLeftPos-leftPos && compLeftPos-leftPos<80 && (compTopPos-topPos)**2<(-30)**2){
            this.img = this.id+"_lf1.gif"
        }
        if (0>compLeftPos-leftPos && compLeftPos-leftPos>-80 && (compTopPos-topPos)**2<(-30)**2){
            this.img = this.id+"_rt1.gif"
        }
        console.log(collisionCheck(charIcon,player.direction,topPos,leftPos,compIcon,compTopPos,compLeftPos))

        this.update()
    }
}


var attacks ={
    punch:{
        staminaCost:10,
        damage:10
    },
    kick:{
        staminaCost:15,
        damage:15
    }
}

function changePosition(element,direction,topPos,leftPos){
    if (direction == "bk"){
        element.css({
            "top":String(topPos-10)+"px"
        })
    }
    if (direction == "fr"){
        element.css({
            "top":String(topPos+10)+"px"
        })
    }
    if (direction == "lf"){
        element.css({
            "left":String(leftPos-10)+"px"
        })
    }
    if (direction == "rt"){
        element.css({
            "left":String(leftPos+10)+"px"
        })
    }
}
function placeCharacter(element,topPos,leftPos){
    element.css({
        'top':topPos,
        'left':leftPos,
    })
}
function collisionCheck(charIcon,direction,topPos,leftPos,compIcon,compTopPos,compLeftPos){
    if((compTopPos-topPos==-40 && (compLeftPos-leftPos)**2<(-40)**2)){
        if (direction=="bk"){
            placeCharacter(charIcon,topPos+30,leftPos)
            return true
        }
    }
    if((compTopPos-topPos==+40 && (compLeftPos-leftPos)**2<(-40)**2)){
         if(direction == "fr"){
            placeCharacter(charIcon,topPos-30,leftPos)
            return true
        }
    }
    if ((compTopPos-topPos)**2<(-40)**2 && (compLeftPos-leftPos)==(-40)){
        if(direction == "lf"){
            placeCharacter(charIcon,topPos,leftPos+30)
            return true
        }
    }
    if ((compTopPos-topPos)**2<(-40)**2 && (compLeftPos-leftPos)==(40)){
        if(direction == "rt"){
            placeCharacter(charIcon,topPos,leftPos-30)
            return true
        }
    }
}
var devil = new Villain('dvl1',100,10);
var spider = new Villain('spd1',100,10)
var knight = new Hero('gsd1',100,100,[],1)

var player = knight;
var comp = devil;

document.onkeydown = function(){
    var action = event.key
    if(action === "ArrowUp"){
        player.direction = "bk"
        player.move('bk')
    }
    if(action === "ArrowDown"){
        player.direction = "fr"
        player.move('fr')
    }
    if(action === "ArrowLeft"){
        player.direction = "lf"
        player.move('lf')
    }
    if(action === "ArrowRight"){
        player.direction = "rt"
        player.move('rt')
    }
    comp.move()
    spider.move()

}