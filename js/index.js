layui.use(['element', 'layer'], function () {
    var element = layui.element,
        layer = layui.layer,
        $ = layui.jquery;

    $('.five').load('art-mange.html')
    $('.six').load('art-rule.html')
    $('.sev').load('circ-mange.html')
    $('.eig').load('circ-rule.html')
    $('.nin').load('main.html')

    //左侧导航
    $('.layui-nav-tree .layui-nav-item').click(function () {
        let ind = $(this).index()

        if (ind == 0) {
            var text1 = '主页管理';
            var text2 = ''
            $('.page').removeClass('act')
            $('.one').addClass('act')

        } else if (ind == 1 || ind == 2 || ind == 3) {
            var text1 = '积分规则管理'
            var text2 = '积分规则'
            $('.page').removeClass('act')
            if (ind == 1) {
                $('.five').addClass('act')
            } else if (ind == 2) {
                $('.sev').addClass('act')
            } else {
                text2 = ''
                $('.nin').addClass('act')
            }
        }

        $('.nav_box').html('').html(`<li class="layui-nav-item new_add color_nav" ><a >${text1}</a></li>
<li class="layui-nav-item new_add " ><a >${text2}</a></li>`)

        $('.nav_box li').click(function () {

            let ind = $('.layui-nav-tree .layui-this').index()

            $(this).siblings('li').removeClass('color_nav').end()
                .addClass('color_nav')
            if (ind == 1) {
                $('.art').removeClass('act')
                    .eq($(this).index()).addClass('act')

            } else if (ind == 2) {
                $('.circ').removeClass('act')
                    .eq($(this).index()).addClass('act')
            }

        })

    })

    let decode = window.atob(location.search.slice(1))
        , arr = decode.split('&')
        , uName = arr[0].split('=')[1]
        , pWord = arr[1].split('=')[1]
        , oldAdr = ''
        , oldSco = '';
    $.post('http://www.shouziliu.com/woniu/user/userdata.php', {
        username: uName,
        password: pWord
    }, function (data) {
        // console.log(data);
        oldAdr = data.address;
        oldSco = data.score;
        $('.now_addred').html(`${data.address}`)
        $('.scored').html(`${data.score}`)
        $('.now_addr').html(`${data.address}`)
        $('.score').html(`${data.score}`)
    })

    let flag = true;
    //操作设置
    //修改地址
    $('.can_do').click(function () {
        $('.nav_box').html('').html(`<li class="layui-nav-item color_nav"><a >操作设置</a></li>`)
        $('.page').removeClass('act')
        $('.two').addClass('act')
    })

    $('.btn_can_do').click(function () {
        $('.nav_box').html('').html(`<li class="layui-nav-item color_nav"><a >内容修改</a></li>`)
        $('.page').removeClass('act')
        $('.thr').addClass('act')
    })

    $('.done').click(changeAddr)//修改完成

    function changeAddr() {
        if ($(this).hasClass('done')) {
            let val = $('#picker').val()
            if (val != '') {
                $('.now_addred').html('').html(val)
            }
        }
        $('.nav_box').html('').html(`<li class="layui-nav-item color_nav"><a >操作设置</a></li>`)
        $('.page').removeClass('act')
        $('.two').addClass('act')
    }

    //修改分数
    $('.chScore').click(changeSco)

    function changeSco() {
        if (flag) {
            flag = false;
            $(this).html('完成')
            let text = $(this).siblings('p').html()
            $(this).siblings('p').replaceWith($(`<input type="text" style="border: none;height: 20px;">`))
            $(this).siblings('input').focus().val(text)
            $('.scored').html('').html(text)
        } else {
            flag = true;
            $(this).html('修改')
            let text = $(this).siblings('input').val()
            $(this).siblings('input').replaceWith($(`<p class="scored">${text}</p>`))
        }
    }

    //修改完成
    $('.alldone').click(function () {

        if($('.chScore').html()==='完成'){
            flag = true;
            $('.chScore').html('修改');
            let text = $('.chScore').siblings('input').val();
            $('.chScore').siblings('input').replaceWith($(`<p class="scored">${text}</p>`));
        }

        let sco = $('.scored').html();
        let addr = $('.now_addred').html();

        console.log(sco, addr);
        if (addr != oldAdr || sco != oldSco) {
            if (addr != '' || sco != '') {
                $.post('http://www.shouziliu.com/woniu/user/change.php', {
                    username: uName,
                    password: pWord,
                    address: addr,
                    score: sco
                }, function (data) {
                    $.post('http://www.shouziliu.com/woniu/user/userdata.php', {
                        username: uName,
                        password: pWord
                    }, function (data) {
                        console.log(data);
                        $('.now_addr').html(`${data.address}`)
                        $('.score').html(`${data.score}`)
                    })
                })
            }
            if (addr != oldAdr) {
                $('.btn_can_do').unbind('click')
                    .click(() => {
                        layer.msg('您每天对同一对象只能修改一次！')
                    })
                setTimeout(() => {
                    $('.btn_can_do').click(changeAddr)
                }, 86400000)
            }
            if (sco != oldSco) {
                $('.chScore').unbind('click')
                    .click(() => {
                        layer.msg('您每天对同一对象只能修改一次！')
                    })
                setTimeout(() => {
                    $('.chScore').click(changeSco)
                }, 86400000)
            }
        }
        $('.page').removeClass('act')
        $('.one').addClass('act')
    })


    //计算时间
    let data = new Date()
        , start = new Date('2018-01-01')
        , count = data - start;
    let hours = count / 1000 / 60 / 60
    // console.log(Math.floor(hours));
    $('#countTime').html(`自2018年至今共${Math.floor(hours)}小时`)


    //内容修改tit

    $('.message').click(function () {
        $('.page').removeClass('act')
        $('.fou').addClass('act')
        $('.message .layui-badge-dot').remove();
    })

    $.post('http://www.shouziliu.com/woniu/user/check.php', {
        username: uName,
        password: pWord
    }, function (data) {
        // console.log(data);
        $('#userName').html(`${data.username}`)
        $('.one .cont_head span').eq(0).html('').html(`欢迎您：${data.username}`)
    }, "json")


    //退出登录
    $('#quit').click(() => {
        $.post('http://www.shouziliu.com/woniu/user/quit.php', {
            username: uName,
            password: pWord
        }, function (data) {
            location.href = 'login.html'
        }, "json")
    })

    $.get('http://www.shouziliu.com/woniu/newjson/', function (data) {
        let newArr = data.news;
        // console.log(newArr);
        newArr.forEach((e, n) => {
            $(`<div class="detil" data-id="${e.newsId}">
                    <span>${e.title}</span><i  class="iconfont icon-xiugai  msg"></i>
                </div>`).appendTo('.new_box')
        })

        //触发事件
        $('.msg').click(function () {
            let cont = null;
            let id = $(this).parent().attr('data-id')
            for (let i = 0; i < newArr.length; i++) {
                if (id == newArr[i].newsId) {
                    cont = newArr[i].content;
                    // console.log(cont);
                    $('.setOver section #reader').html('').html(`${ cont[0].reader}`)
                    $('.setOver section #mess').html('').html(`${ cont[0].message}`)
                    $('.setOver section #sendtime').html('').html(`${ cont[0].sendtime}`)
                    break;
                }
            }

            $('.setOver').css({
                opacity: 1
            })
            $('.setOver .sure').click(function () {
                $('.setOver').css({
                    opacity: 0
                })
                cont = null;
                id = '';
            })

            $('.setOver .del').click(function () {
                $('.new_box div').each((n, e) => {
                    if ($(e).attr('data-id') == id) {
                        $(e).remove()
                    }
                })
                $('.setOver').css({
                    opacity: 0
                })
                cont = null;
                id = '';
            })
        })
    })
})








