$(function(){
    var isWalking = false
    var walking;

    characterSelectorBar()
    
    $('.villainsParent').on({
        mouseenter:function(){
            console.log('dyn')
            if (isWalking ==false){
                isWalking = true
                walking = setInterval(()=>{
                    walkAnim($(this))
                },200);
            }
        },
        mouseleave:function(){
            clearInterval(walking)
            isWalking=false
        }
    },'.char');
    $('.heroesParent').on({
        mouseenter:function(){
            console.log('dyn')
            if (isWalking ==false){
                isWalking = true
                walking = setInterval(()=>{
                    walkAnim($(this))
                },200);
            }
        },
        mouseleave:function(){
            clearInterval(walking)
            isWalking=false
        }
    },'.char');
    

    $('.heroesParent').on('click','.hero',function(){
        player = new Hero($(this).attr('name'),100,100,defaultAttacks,2)
        $(".heroes").remove()
        $(".selectPlayer").addClass('d-none')
        $(".villains").removeClass('d-none')
        $(".selectVillains").removeClass('d-none')
    });
    $('.villainsParent').on('click','.villain',function(){
        var name = $(this).attr('name');
        var lvl = Math.floor(Math.random()*(game.level+3))+1
        var counter = comp.length
        game['villain'+counter] = new Villain(name,lvl)
        comp.push(game['villain'+comp.length])
        $(this).remove()
        $("#start").removeClass('d-none')
    });
});

function walkAnim(img){
    var link = img.attr('src')
    var name = img.attr('name')
    if (link.search('_fr1')>-1){
        img.attr('src','assets/images/sprites/'+name+'_fr2.gif')
    }else{
        img.attr('src','assets/images/sprites/'+name+'_fr1.gif')
    }
}

function characterSelectorBar(){
        var charList=['scr1','pdn1','mst1','mnv1','bmg3','avt4','knt3','nja4','npc9','smr1','wmg1','zph1','npc4'];
        var evilList=['chr1','dvl1','skl1','spd1','syb1','thf1','thf2','thf3','trk1','wnv1','wnv2','npc5','npc6','npc7']
    
        if(game.level===1){ //this conditional is added so that this function can be run again without creating a new hero if player moves onto the next level

        var heroContainer=$("<div>")
        heroContainer.addClass("fixed-bottom heroes bg-light")
        for (var i in charList){
            var img = $("<img>").attr('src','assets/images/sprites/'+charList[i]+'_fr1.gif')
            img.attr('name',charList[i])
            img.addClass('hero')
            img.addClass('char')
            heroContainer.append(img)
        }
    }
    $(".selectPlayer").parent().append(heroContainer)
    var evilContainer = $("<div>")
    evilContainer.addClass("fixed-bottom villains bg-light d-none")
    for (var i in evilList){
        var img = $("<img>").attr('src','assets/images/sprites/'+evilList[i]+'_fr1.gif')
        img.attr('name',evilList[i])
        img.addClass('villain')
        img.addClass('char')

        evilContainer.append(img)
    }
    $(".selectVillains").parent().append(evilContainer)

}

