
$(function(){
    devil.create(300,600);
    knight.create(300,450);
    spider.create(200,400);
});

var game = {
    won:function(){

    },
    lost:function(){

    }
}

function Hero(id,hp,maxStamina,attacks,staminaLoadSpeed){
    this.id=id;
    this.create = function(top,left){
        var charDiv = $("<div>")
        var img = $("<img>")
        img.attr("src","assets/images/sprites/"+this.img)
        charDiv.attr("id",this.id)
        charDiv.css({
            "position":"fixed",
            "top":top+"px",
            "left":left+"px"
        })
        charDiv.append(img)
        var health = $("<div>").addClass("progress");
        health.css({
            'height':'5px',
            'margin-bottom':'10px'
        })
        var bar = $("<div>").addClass("progress-bar bg-danger");
        bar.attr("role","progressbar");
        bar.attr("id",this.id+"Health")
        bar.css({
            'width':String(this.hp)+"%"
        })
        health.append(bar)
        charDiv.prepend(health)
        $("body").append(charDiv)

    };
    this.update = function(){
        var img = $("#"+this.id).children().last()
        img.attr("src","assets/images/sprites/"+this.img)
        var health = $("#"+this.id+"Health")
        health.css({
            'width':String(this.hp)+'%'
        })
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
        changePosition(charIcon,direction,topPos,leftPos)

        if (this.img.search(direction+"1")>-1){
            this.img = this.id+"_"+direction+"2.gif";
        }
        else{
            this.img=this.id+"_"+direction+"1.gif";
        }
        this.update()
    };
    this.dead=function(){
        game.lost()
    }
}

function Villain(id,maxHp,counter){
    this.id=id;
    this.update = function(){
        var img = $("#"+this.id).children().last()
        img.attr("src","assets/images/sprites/"+this.img)
        var health = $("#"+this.id+"Health")
        health.css({
            'width':String((this.hp/maxHp)*100)+"%"
        })
    };
    this.img= this.id+"_fr1.gif";
    this.hp=maxHp;
    this.counter=function(){
        player.hp-=counter;
    };
    this.create = function(top,left){
        var charDiv = $("<div>")
        var img = $("<img>")
        img.attr("src","assets/images/sprites/"+this.img)
        charDiv.attr("id",this.id)
        charDiv.css({
            "position":"fixed",
            "top":top+"px",
            "left":left+"px"
        })
        charDiv.append(img)
        var health = $("<div>").addClass("progress");
        health.css({
            'height':'5px',
            'margin-bottom':'10px'
        })
        var bar = $("<div>").addClass("progress-bar bg-danger");
        bar.attr("role","progressbar");
        bar.attr("id",this.id+"Health")
        bar.css({
            'width':String((this.hp/maxHp)*100)+"%"
        })
        health.append(bar)
        charDiv.prepend(health)
        $("body").append(charDiv)

    };
    this.move=function(){
        var charIcon = $("#"+player.id)
        var topPos = Number(charIcon.css("top").split("px")[0])
        var leftPos = Number(charIcon.css("left").split("px")[0])
        
        var compIcon = $("#"+this.id)
        var compTopPos = Number(compIcon.css("top").split("px")[0])
        var compLeftPos = Number(compIcon.css("left").split("px")[0])
       
        //villain turns towards the player when player is close enough
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
        if(collisionCheck(charIcon,player.direction,topPos,leftPos,compIcon,compTopPos,compLeftPos)==true){
            player.attacks.melee(this)
            this.counter()
        }

        this.update()
    }
    this.dead=function(){
        this.counter=0
        comp.pop(this)
    }
}


var attacks ={
    melee:function(target){
        target.hp = target.hp-10
    },
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
    //returns true if collision occurs so that melee attack can be registered
    //coming from bottom of npc
    if((0>compTopPos-topPos && compTopPos-topPos>-50 && (compLeftPos-leftPos)**2<(-30)**2)){
        if (direction=="bk"){
            placeCharacter(charIcon,topPos+30,leftPos)
            return true
        }
    }
    ////coming from top of npc
    if((0<compTopPos-topPos && compTopPos-topPos<40 && (compLeftPos-leftPos)**2<(-30)**2)){
         if(direction == "fr"){
            placeCharacter(charIcon,topPos-30,leftPos)
            return true
        }
    }
    //coming from right of npc
    if ((0>compLeftPos-leftPos && compLeftPos-leftPos>-40 && (compTopPos-topPos)**2<(-30)**2)){
        if(direction == "lf"){
            placeCharacter(charIcon,topPos,leftPos+30)
            return true
        }
    }
    //coming from left of npc
    if ((0<compLeftPos-leftPos && compLeftPos-leftPos<40 && (compTopPos-topPos)**2<(-30)**2)){
        if(direction == "rt"){
            placeCharacter(charIcon,topPos,leftPos-30)
            return true
        }
    }
}
function death(character){
    if(character.hp<=0){
        var positionList = ["_fr1.gif","_lf1.gif","_bk1.gif","_rt1.gif"]
        var i=0
        var r=0
        var deathSeq = setInterval(()=>{
            deathAnim(positionList[r],character)
            console.log(positionList[i])
            r+=1
            if (r==4){r=0}
            i+=1
            if (i==8){
                clearInterval(deathSeq)
                $("#"+character.id).remove()
            }
        },200)
        character.dead()
    }
}
function deathAnim(position,character){
    character.img=character.id+position;
    character.update();
}

var devil = new Villain('dvl1',100,10);
var spider = new Villain('spd1',50,2)
var knight = new Hero('gsd1',100,100,attacks,1)

var player = knight;
var comp = [devil,spider]

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
    for(var i in comp){
        comp[i].move()
        death(comp[i])
    }
    if(comp.length==0){
       game.won()
    }
    death(player)

    

}

