new Vue({
    el: "#main",
    data: {
        showErrorForm: true,
        showMoreButton: true,
        limit: 12,
        restImages: 0,
        lastID: 100000,
        images: null,
        username: "",
        title: "",
        description: "",
        file: null,
        selectedImageID: "",
    },
    mounted: function () {
        axios.get("/api/images/" + this.lastID + "/" + this.limit).then((res) => {
            console.log(res.data);
            this.images = res.data["imageArray"];
            this.restImages = res.data["restImages"];
            this.lastID = res.data["lastID"];
        });
    },
    methods: {
        showMoreImages: function () {
            axios.get("/api/images/" + this.lastID + "/" + this.limit).then((res) => {
                console.log(res.data);
                this.images.push(...res.data["imageArray"]);
                this.restImages = res.data["restImages"];
                this.lastID = res.data["lastID"];
                if (this.restImages === 0) {
                    this.showMoreButton = false;
                }
            });
        },
        uploadImage: function () {
            const uploadData = new FormData();
            if(this.title && this.username && this.file && this.description) {
                uploadData.append("title", this.title);
                uploadData.append("username", this.username);
                uploadData.append("file", this.file);
                uploadData.append("description", this.description);
                axios
                    .post("/api/upload", uploadData)
                    .then((response) => {
                        console.log("upload successfully", response.data);
                        this.images.unshift(response.data);
                        this.title = "";
                        this.username = "";
                        this.description = "";
                        this.file = null;
                    })
                    .catch((err) => err);
            } else {
                this.showErrorForm = false;
            }

        },
        fileSelected: function (event) {
            this.file = event.target.files[0];
        },
    },
    created: function() {
        let didScroll = false;
        document.addEventListener('scroll', ()=>{
            didScroll = true;
        });
        const showMoreImages = this.showMoreImages;
        setInterval(function(){
            if(didScroll){
                didScroll=false;
                const documentTopPosition = document.documentElement.scrollTop;
                const screenHeight = window.innerHeight;
                const documentHeight = document.documentElement.offsetHeight;
                const triggerPoint = documentHeight - 2*screenHeight < documentTopPosition;
                console.log(documentHeight, screenHeight, documentTopPosition, documentHeight - 2*screenHeight, triggerPoint);
                if(triggerPoint) {
                    showMoreImages();
                }

            }
        }, 250);
    },
});

Vue.component("modal", {
    data: function () {
        return {
            image: {},
        };
    },
    props: ["id"],
    template: "#modal",
    mounted: function () {
        axios.get("/api/image/" + this.id).then((res) => {
            this.image = res.data;
        });
    },
});

Vue.component("comments", {
    data: function () {
        return {
            comments: [],
            comment:"",
            userNameComment:""
        };
    },
    props: ["id"],
    template: "#comments",
    methods:{
        addComment: function (){
            console.log(this.comment);
            console.log(this.userNameComment);
            console.log(this.id);
            const commentData = {...{"comment": this.comment},...{"userName": this.userNameComment},...{"imageID": this.id}};
            console.log(commentData);
            axios.post("/api/comment", commentData)
                .then((response) => {
                    console.log("upload successfully", response.data);
                    this.comments.push(response.data.rows[0]);
                    this.comment = "";
                    this.userNameComment = "";
                })
                .catch((err) => err);
        }
    },
    mounted: function () {
        axios.get("/api/comments/" + this.id).then((res) => {
            this.comments = res.data.rows;
        });
    },
});
