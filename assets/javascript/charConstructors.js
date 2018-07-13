function Hero(id,maxHp,maxStamina,attacks,staminaLoadSpeed){
    this.id=id;
    this.create = function(top,left){
        var charDiv = $("<div>")
        //PLAYER ICON
        {
            var img = $("<img>")
            img.addClass("mx-auto d-block")
            img.attr("src","assets/images/sprites/"+this.img)
            charDiv.attr("id",this.id)
            charDiv.css({
                "position":"fixed",
                "top":top+"px",
                "left":left+"px"
            })
            charDiv.append(img)
        }
       
        // STAMINA BAR
        {
            var stamina = $("<div>").addClass("progress");
            stamina.css({
                'height':'5px',
                'margin-bottom':'10px'
            })
            var staminaBar = $("<div>").addClass("progress-bar bg-success");
            staminaBar.attr("role","progressbar");
            staminaBar.attr("id",this.id+"Stamina")
            staminaBar.css({
                'width':String(this.stamina)+"%"
            })
            stamina.append(staminaBar)
            charDiv.prepend(stamina)
    
        }
       
        //HEALTH BAR
        {
            var health = $("<div>").addClass("progress");
            health.css({
                'height':'5px',
                'margin-bottom':'1px'
            })
            var healthBar = $("<div>").addClass("progress-bar bg-danger");
            healthBar.attr("role","progressbar");
            healthBar.attr("id",this.id+"Health")
            healthBar.css({
                'width':String(this.hp)+"%"
            })
            health.append(healthBar)
            charDiv.prepend(health)
        }

        //XP BAR
        {
            var xp = $("<div>").addClass("progress");
            xp.css({
                'height':'2px',
                'margin-top':'5px'
            })
            var xpBar = $("<div>").addClass("progress-bar bg-primary");
            xpBar.attr("role","progressbar");
            xpBar.attr("id",this.id+"Xp")
            xpBar.css({
                'width':String(this.xp)+"%"
            })
            xp.append(xpBar)
            charDiv.append(xp)
        }
       
        //LVL Text
        {
            var level = $("<div>").text("LVL: "+this.level)
            level.attr("id",this.id+"Level")
            level.css({
                "font-size":"10px",
                'color':'white'
            })
            charDiv.append(level)
            $("body").append(charDiv)
        }
    };
    this.update = function(){
        var img = $("#"+this.id).children().last().prev().prev()
        img.attr("src","assets/images/sprites/"+this.img)
        var health = $("#"+this.id+"Health")
        health.css({
            'width':String(this.hp)+'%'
        })
        var stamina = $("#"+this.id+"Stamina")
        stamina.css({
            'width':String(this.stamina)+'%'
        })
        var xp = $("#"+this.id+"Xp")
        xp.css({
            'width':String((this.xp/game.targetXp)*100)+'%'
        })
        var level = $("#"+this.id+"Level")
        level.text("LVL: "+this.level)
    },
    this.img= this.id+"_fr1.gif"
    this.xp=0;
    this.level=1;
    this.hp=maxHp;
    this.maxHp=maxHp;
    this.maxStamina=maxStamina;
    this.stamina=maxStamina;
    this.attacks=attacks;
    this.loadingStamina = false;
    this.staminaLoadSpeed=staminaLoadSpeed
    this.staminaLoad = function(){
        if (this.stamina<this.maxStamina && this.loadingStamina===false){
            this.loadingStamina=true
            var loader = setInterval(()=>{
                this.update()
                this.stamina+=this.staminaLoadSpeed;
                if (this.stamina>this.maxStamina){
                    this.stamina = this.maxStamina
                    this.loadingStamina=false
                    clearInterval(loader)
                }else if(this.stamina === this.maxStamina){
                    this.loadingStamina=false
                    clearInterval(loader)
                }
            },1000)
    
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

function Villain(id,lvl){
    var maxHp = lvl*50;
    var counter = lvl*2;
    var killXp = lvl*25;

    this.id=id;
    this.update = function(){
        var img = $("#"+this.id).children().last().prev()
        img.attr("src","assets/images/sprites/"+this.img)
        var health = $("#"+this.id+"Health")
        health.css({
            'width':String((this.hp/(maxHp))*100)+"%"
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

        //LVL Text
        {
            var level = $("<div>").text("LVL: "+lvl)
            level.attr("id",this.id+"Level")
            level.css({
                "font-size":"10px",
                "color":"white"
            })
            charDiv.append(level)
            $("body").append(charDiv)
        }

    };
    this.move=function(){
        if(game.dying===false){ //avoids accidental movements while a villain is dying
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
                player.attacks.melee.hit(this)
                this.counter()
            }
    
            this.update()
        }
    }
       
    this.dead=function(){
        comp.splice(comp.indexOf(this),1)
        player.xp+=killXp
        levelUp()
        this.move=null
    }
}

var player;
var comp = []