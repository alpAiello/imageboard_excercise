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
            if(this.title && this.userName && this.file && this.description) {
                uploadData.append("title", this.title);
                uploadData.append("username", this.username);
                uploadData.append("file", this.file);
                uploadData.append("description", this.description);
                axios
                    .post("/api/upload", uploadData)
                    .then((response) => {
                        console.log("upload successfully", response.data);
                        this.images.unshift(response.data);
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
    watch: function() {

    },
    created: function() {
        document.addEventListener('scroll', ()=>{
            console.log(document.documentElement.scrollTop, window.innerHeight, document.documentElement.offsetHeight);
        });
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
