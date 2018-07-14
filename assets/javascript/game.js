
$(function(){
    
    document.onkeydown = function(){
        if (game.inProgress){
            var action = event.key
            if(action === "ArrowUp"){
                player.direction = "bk"
                player.move('bk')
            }else
            if(action === "ArrowDown"){
                player.direction = "fr"
                player.move('fr')
            }else
            if(action === "ArrowLeft"){
                player.direction = "lf"
                player.move('lf')
            }else
            if(action === "ArrowRight"){
                player.direction = "rt"
                player.move('rt')
            }else{return}

            for(var i in comp){
                comp[i].move()
                death(comp[i])
            }
            if(comp.length==0){
               game.won()
            }
            death(player)
            player.staminaLoad()
        }
    }
    $("#start").click(function(){
        game.start()
        $(this).addClass('d-none')
        $("#levels").text("Level: "+game.level)
        $("#levels").removeClass('d-none')
        $(".villains").remove()
    });
    $("#restart").click(function(){
        console.log('restarted')
        game.level=1
        for(var i in comp){
            $("#"+comp[i].id).remove();
            comp[i]=null;
        }
        comp=[]
        $(".selectPlayer").removeClass('d-none')
        characterSelectorBar()
        player=null
        $("#lostModal").modal('toggle')
    });

});


var game = {
    inProgress : false,
    won:function(){
        console.log(game.level)
        game.inProgress=false;
        game.level+=1
        $(".selectVillains").removeClass('d-none')
        $("#start").text('Next Level')
        characterSelectorBar()
        $(".villains").removeClass('d-none')
    },
    lost:function(){
        console.log('lost')
        $("#lostModal").modal({backdrop: 'static', keyboard: false})
    },
    level:1,
    targetXp:100,
    newTargetXp:function(){
        var newTarg = game.targetXp**(1+player.level/50);
        game.targetXp = newTarg
    },
    dying:false,
    start: function(){
        var locList=[]
        for (var i in comp){
            var coordinates = getRandCoordinate()
            while(checkCoordinates(coordinates,locList)=='again'){
                coordinates = getRandCoordinate()
            }
            locList.push(coordinates)
            comp[i].create(coordinates[0],coordinates[1])
        }
        if (game.level===1){
            player.create(500,1200)
        }
        game.inProgress= true
        $(".selectVillains").addClass('d-none')
        $('.selectPlayer').addClass('d-none')
    }   
}

function getRandCoordinate(){
    var top = Math.floor(Math.random()*300)+200
    var left=Math.floor(Math.random()*1000)
    return[top,left]
}
function checkCoordinates(coordinates,locList){ //makes sure that villains don't accidentally overlap
    var newTop = coordinates[0]
    var newLeft = coordinates[1]
    for (var i in locList){
        var oldTop = locList[i][0]
        var oldLeft = locList[i][1]
        if (((oldLeft-newLeft)**2)<(30**2) && ((oldTop-newTop)**2)<(30**2)){
            return 'again'
        }    
    }
}

function Attack(damage,staminaCost){
    this.damage=damage;
    this.staminaCost=staminaCost;
    this.hit=function(target){
        if(player.stamina>staminaCost){
            target.hp-=this.damage;
            player.stamina-=this.staminaCost;
        }
    }
}

var defaultAttacks ={
    melee : new Attack(10,10)
}
var advancedAttacks={

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
        game.dying=true;
        var positionList = ["_fr1.gif","_lf1.gif","_bk1.gif","_rt1.gif"]
        var i=0
        var r=0
        var deathSeq = setInterval(()=>{
            deathAnim(positionList[r],character)
            r+=1
            if (r==4){r=0}
            i+=1
            if (i==8){
                clearInterval(deathSeq)
                $("#"+character.id).remove()
                game.dying=false;
            }
        },200)
        character.dead()
    }
}
function deathAnim(position,character){
    character.img=character.id+position;
    character.update();
}

//lvl 1 Villain('ID',[maxHP: 50,counter:2,killXp:25],lvl) lvl 2 Villain('ID',100,4,50) etc...




