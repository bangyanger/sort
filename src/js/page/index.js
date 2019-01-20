require(["config"], function() {
    require(["jquery", "better"], function($, better) {
        var key = ""; //搜索关键字
        var type = "normal"; //排序类型
        var page = 1,
            limit = 5,
            total = 0;
        init();

        function init() {
            load();
            bscrooll();
            clickadd();
        }

        function clickadd() {
            $(".qie").on("click", function() {
                $(".list").toggleClass("target")
            });
            $("nav span").on("click", function() {
                    $(this).addClass('active').siblings().removeClass('active');
                })
                //点击搜索
            $(".btn").on("click", function() {
                    $(".list").html("")
                    key = $(".inp").val();
                    load()
                })
                //销量
            $(".sale-sort").on("click", function() {
                $(".list").html("")
                type = "sale"
                console.log(type)
                load()
            })
            $(".asc").on("click", function() {
                $(".list").html("")
                type = "asc"
                console.log(type)
                load()
            })
            $(".desc").on("click", function() {
                $(".list").html("")
                type = "desc"
                console.log(type)
                load()
            })
        }

        function bscrooll() {
            var bscroo = new better(".list-wrap", {
                click: true,
                probeType: 2
            })

            bscroo.on("scroll", function() {
                if (this.y < this.maxScrollY - 44) {

                    if (page < total) {
                        $(".list").attr("up", "释放加载")
                    } else {
                        $(".list").attr("up", "end")
                    }
                } else if (this.y < this.maxScrollY - 22) {
                    if (page < total) {
                        $(".list").attr("up", "上拉加载")
                    } else {
                        $(".list").attr("up", "end")
                    }
                }
            })

            bscroo.on("touchEnd", function() {
                if ($(".list").attr("up") == '释放加载') {
                    if (page < total) {
                        console.log(0)
                        page++;
                        load();
                        $(".list").attr("up", "上拉加载")
                    } else {
                        $(".list").attr("up", "end")
                    }
                }
            })
        }


        function load() {
            console.log(type)
            key = key || "";
            $.ajax({
                url: "/api/list",
                data: {
                    key: key,
                    type: type,
                    page: page,
                    limit: limit,
                },
                dataType: "json",
                success: function(data) {
                    total = data.total
                    random(data);
                }
            })
        }

        function random(res) {
            var str = "";
            res.data.forEach(function(item) {
                str += ` <dl>
                <dt>
                            <img src="${item.url}" alt="">
                        </dt>
                <dd>
                    <h2>${item.title}</h2>
                    <p>价格：<span class="price">${item.price}</span></p>
                    <p>销量：<span class="sale">${item.salenum}</span></p>
                </dd>
            </dl>`
            })
            $(".list").append(str)

        }
    })
})