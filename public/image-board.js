new Vue({
    el: "#main",
    data: {
        imageJSON: null
    },
    mounted: function (){
        axios.get("/api/images")
            .then((res)=>{
                this.imageJSON = res.data;
            })
    }
})