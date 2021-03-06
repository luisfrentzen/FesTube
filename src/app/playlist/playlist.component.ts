import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, AfterViewInit, AfterContentInit {

  constructor(private route : ActivatedRoute, private router : Router, private apollo : Apollo, private data : DataService) { }

  currentPlaylist;
  videos;
  playlistOwner;

  getLen(vids)
  {
    return vids.length
  }

  copyToClipboard() {
    var from = document.getElementById('link');
    var range = document.createRange();
    window.getSelection().removeAllRanges();
    range.selectNode(from);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
 }

  getMonthName(mon)
  {
    if(mon == 1)
    {
      return "Jan"
    }
    else if(mon == 2)
    {
      return "Feb"
    }
    else if(mon == 3)
    {
      return "Mar"
    }
    else if(mon == 4)
    {
      return "Apr"
    }
    else if(mon == 5)
    {
      return "May"
    }
    else if(mon == 6)
    {
      return "Jun"
    }
    else if(mon == 7)
    {
      return "Jul"
    }
    else if(mon == 8)
    {
      return "Aug"
    }
    else if(mon == 9)
    {
      return "Sep"
    }
    else if(mon == 10)
    {
      return "Oct"
    }
    else if(mon == 11)
    {
      return "Nov"
    }
    else if(mon == 12)
    {
      return "Dec"
    }

    return ""
  }

  getViewCount(view){
    var res;
    if(view >= 1000000)
    {
      res = (view/1000000).toFixed(1) + "M"
    }
    else if(view >= 1000)
    {
      res = (view/1000).toFixed(1) + "K"
    }
    else
    {
      res = view;
    }

    return res;
  }

  users = [];
  user;

  curUserId;

  currentUserInfo;
  isSubscribed = false;

  subs = [];

  isBelled = false;
  notifieds;

  onNotification(){

    this.apollo
        .mutate({
          mutation : gql`
            mutation notify($id: String!, $chnid: String!){
              bellnotif(id:$id, chnid:$chnid){
                name
              }
            }
          `,
          variables : {
            id: this.currentUserInfo.id,
            chnid: this.currentPlaylist.userid,
          },
          refetchQueries: [{
            query: gql`
              query userById($userid: String!){
                userById(userid: $userid){
                  id,
                  name,
                  profilepic,
                  subscribers,
                  subscribed,
                  likedvideos,
                  likedcomments,
                  disilikedvideos,
                  disilikedcomments,
                  notified,
                }
              }
            `,
            variables: {
              userid: this.currentUserInfo.id,
            }
          }]
        }).subscribe(({ data }) => {
      console.log('got data', data);

      this.isBelled = !this.isBelled
      console.log(this.isBelled)
      this.notifieds = this.currentUserInfo.notified.split(",")
      if(this.notifieds.includes(this.currentPlaylist.userid))
      {
        this.isBelled = true;
      }
      else
      {
        this.isBelled = false;
      }

    },(error) => {
      console.log('there was an error sending the query', error);
    });

  }

  toggleSubs(){
    if(localStorage.getItem('users') == null){
      return
    }

    this.apollo
        .mutate({
          mutation : gql`
            mutation subscribe($id: String!, $chnid: String!){
              subscribe(id: $id, chnid: $chnid){
                name
              }
            }
          `,
          variables : {
            id: this.currentUserInfo.id,
            chnid: this.currentPlaylist.userid,
          },
          refetchQueries: [{
            query: gql`
              query userById($userid: String!){
                userById(userid: $userid){
                  id,
                  name,
                  profilepic,
                  subscribers,
                  subscribed,
                  likedvideos,
                  likedcomments,
                  disilikedvideos,
                  disilikedcomments,
                  premium,
                }
              }
            `,
            variables: {
              userid: this.currentPlaylist.userid,
            }
          },
          {
            query: gql`
              query userById($userid: String!){
                userById(userid: $userid){
                  id,
                  name,
                  profilepic,
                  subscribers,
                  subscribed,
                  likedvideos,
                  likedcomments,
                  disilikedvideos,
                  disilikedcomments,
                  notified
                }
              }
            `,
            variables: {
              userid: this.currentUserInfo.id,
            }
          }]
        }).subscribe(({ data }) => {
      console.log('got data', data);
      this.isSubscribed = !this.isSubscribed

      if(this.currentUserInfo.subscribed = "")
      {
        this.subs = this.currentUserInfo.subscribed.split(",")
      }
      else
      {
        this.subs = []
      }

      if ( this.subs.includes(this.currentPlaylist.userid) )
      {
        this.isSubscribed = true;
      }
      else
      {
        this.isSubscribed = false;
      }

    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

  lastKey;
  observer;

  // checkScroll(){
  //   var d = document.querySelector(".playlistVideos")
  //   if(d.scrollHeight - d.offsetHeight - d.scrollTop < 1) {
  //     alert("test")
  //   }
  // }
  randid = 0;
  toggleEditTitle = false;
  toggleEditDesc = false;
  toggleEditVisibility = false;

  editedDesc = "";
  editedVis = "";
  editedTitle = "";

  isUserPrem = 'no';

  getCategory() {
    const selectOpt  = document.getElementById('visSelect');
    this.editedVis = selectOpt.value
    console.log(this.editedVis)
  }

  compareView(a,b){
    // let comparison = 0;

    if(a.view > b.view) {
      return -1
    }
    if(a.view < b.view){
      return 1
    }

    return 0;
  }

  compareDate(a,b){
    // let comparison = 0;

    if(a.year * 365 + a.month * 30 + a.day > b.year * 365 + b.month * 30 + b.day) {
      return -1
    }
    if(a.year * 365 + a.month * 30 + a.day < b.year * 365 + b.month * 30 + b.day){
      return 1
    }

    return 0;
  }

  customSort(type, idx){

    if(type == 'toup'){
      if(idx == 0) return
      let temp = this.videos[idx]
      this.videos[idx] = this.videos[idx-1]
      this.videos[idx-1] = temp;
    }
    else if(type == 'todown'){
      if(idx == this.videos.length-1) return
      let temp = this.videos[idx]
      this.videos[idx] = this.videos[idx+1]
      this.videos[idx+1] = temp;
    }
    else if(type == 'toveryup'){
      if(idx == 0) return
      let temp = this.videos[idx]
      this.videos.splice(idx, 1)
      this.videos.unshift(temp)
    }
    else if(type == 'toverydown'){
      if(idx == this.videos.length-1) return
      let temp = this.videos[idx]
      this.videos.splice(idx, 1)
      this.videos.push(temp)
    }

    let res = []
    this.videos.forEach(element => {
      res.push(element.id)
    });
    let resultStr = res.join(",")
    console.log(resultStr)
    this.apollo
      .mutate({
        mutation: gql`
          mutation sort($plid: Int!, $videos: String!){
            updatePlaylistSort(id: $plid, videos: $videos){
              videos
            }
          }
        `,
        variables: {
          plid: this.currentPlaylist.id,
          videos: resultStr,
        },
      })
      .subscribe(({ data }) => {
        console.log('got data', data);
        // this.router.navigateByUrl('');

      },(error) => {
        console.log('there was an error sending the query', error);
      })
  }

  sortDatePub = 'Newest'

  sortVideosBy(sortBy){
    let sorted = this.videos
    // console.log(sorted)
    if(sortBy == 'view'){
      sorted.sort(this.compareView)
    }
    else if(sortBy == 'date')
    {
      sorted.sort(this.compareDate)

      if(this.sortDatePub == 'Newest'){
        sorted = sorted.reverse()
      }
    }

    let res = []
    sorted.forEach(element => {
      res.push(element.id)
    });
    let resultStr = res.join(",")
    console.log(resultStr)
    this.apollo
      .mutate({
        mutation: gql`
          mutation sort($plid: Int!, $videos: String!){
            updatePlaylistSort(id: $plid, videos: $videos){
              videos
            }
          }
        `,
        variables: {
          plid: this.currentPlaylist.id,
          videos: resultStr,
        },
      })
      .subscribe(({ data }) => {
        console.log('got data', data);
        // this.router.navigateByUrl('');

      },(error) => {
        console.log('there was an error sending the query', error);
      })

    // console.log(sorted)
  }

  deletePlaylist(){
    this.apollo
      .mutate({
        mutation: gql`
          mutation delete($plid: Int!){
            deletePlaylist(id: $plid)
          }
        `,
        variables: {
          plid: this.currentPlaylist.id,
        },
      })
      .subscribe(({ data }) => {
        console.log('got data', data);
        this.router.navigateByUrl('');

      },(error) => {
        console.log('there was an error sending the query', error);
      })
  }

  editPlaylist(de, vi, ti){
    // vi = "a"
    console.log(ti)
    this.apollo
      .mutate({
        mutation: gql`
          mutation edit($plid: ID!, $desc: String!, $visibility: String!, $title: String!){
            editPlaylist(id: $plid, desc: $desc, visibility: $visibility, title: $title){
              videos
            }
          }
        `,
        variables: {
          plid: parseInt(this.currentPlaylist.id),
          desc: de == "" ? this.currentPlaylist.desc : de,
          visibility: vi == "" ? this.currentPlaylist.visibility : vi,
          title: ti == "" ? this.currentPlaylist.title : ti
        },
        refetchQueries: [{
          query: gql`
            query playlistById($id: Int!){
              playlistById(id: $id){
                id,
                title,
                userid,
                view,
                day,
                month,
                year,
                desc,
                videos,
                visibility,
              }
            }
          `,
          variables: {
            id: this.currentPlaylist.id,
          }
        }]
      })
      .subscribe(({ data }) => {
        console.log('got data', data);
          // window.location.reload();
        if(vi != ""){
          this.toggleEditVisibility = false;
        }
        else if(de != "")
        {
          this.toggleEditDesc = false;
        }
        else if(ti != "")
        {
          this.toggleEditTitle = false;
        }
      },(error) => {
        console.log('there was an error sending the query', error);
      })
  }

  firstPlay(){
    if(this.videos.length != 0)
    {
      this.router.navigateByUrl("watch/" + this.videos[0].id + "/" + this.currentPlaylist.id)
    }
  }

  shufflePlay(){
    if(this.videos.length != 0)
    {
      this.router.navigateByUrl("watch/" + this.videos[Math.floor(Math.random() * this.videos.length)].id + "/" + this.currentPlaylist.id)
    }
  }

  shufflePlaylist(){
    this.apollo
      .mutate({
        mutation: gql`
          mutation shuffle($plid: ID!){
            shuffleVideos(plid: $plid){
              videos
            }
          }
        `,
        variables: {
          plid: parseInt(this.currentPlaylist.id),
        },
        refetchQueries: [{
          query: gql`
            query playlistById($id: Int!){
              playlistById(id: $id){
                id,
                title,
                userid,
                view,
                day,
                month,
                year,
                desc,
                videos,
                visibility,
              }
            }
          `,
          variables: {
            id: this.currentPlaylist.id,
          }
        }]
      })
      .subscribe(({ data }) => {
        console.log('got data', data);
        let v = this.videos
        let vinDb = this.currentPlaylist.videos.split(",")
        this.videos = new Array(v.length)
        for (let i = 0; i < v.length; i++) {
          this.videos[vinDb.indexOf(v[i].id)] = v[i]

        }
          // window.location.reload();
      },(error) => {
        console.log('there was an error sending the query', error);
      })
  }

  removeAll(){
    this.apollo
      .mutate({
        mutation: gql`
          mutation removevidfrompl($id: ID!) {
            removeAllFromPlaylist(id: $id ){
              title,
            }
          }
        `,
        variables: {
          id: parseInt(this.currentPlaylist.id),
        },
      })
      .subscribe(({ data }) => {
        console.log('got data', data);
        // this.isLiked = !this.isLiked;
        // console.log(this.isLiked);
        // this.addModeLink = false;
      },(error) => {
        console.log('there was an error sending the query', error);

        this.apollo.watchQuery({
          query: gql`
            query videosByIds($id: String!){
              videosByIds(id: $id){
                id,
                title,
                thumbnail,
                channelname,
                userid,
                view,
                day,
                month,
                year,
                desc,
                premium,
              }
            }
          `,
          variables: {
            id: this.currentPlaylist.videos,
          }
        })
        .valueChanges.subscribe(result => {
          this.videos = result.data.videosByIds
          console.log(this.videos)
          window.location.reload();
        })
      });
  }

  removeVideo(vidid){
    console.log(parseInt(vidid))
    console.log(parseInt(this.currentPlaylist.id))
    this.apollo
      .mutate({
        mutation: gql`
          mutation removevidfrompl($id: ID!, $videoid: Int!) {
            removeFromPlaylist(id: $id, videoid: $videoid ){
              title,
            }
          }
        `,
        variables: {
          id: parseInt(this.currentPlaylist.id),
          videoid: parseInt(vidid),
        },
      })
      .subscribe(({ data }) => {
        console.log('got data', data);
        // this.isLiked = !this.isLiked;
        // console.log(this.isLiked);
        // this.addModeLink = false;
      },(error) => {
        console.log('there was an error sending the query', error);

        this.apollo.watchQuery({
          query: gql`
            query videosByIds($id: String!){
              videosByIds(id: $id){
                id,
                title,
                thumbnail,
                channelname,
                userid,
                view,
                day,
                month,
                year,
                desc,
                premium,
              }
            }
          `,
          variables: {
            id: this.currentPlaylist.videos,
          }
        })
        .valueChanges.subscribe(result => {
          this.videos = result.data.videosByIds
          console.log(this.videos)
          // location.reload()
          window.location.reload();
        })
      });
  }

  viewVidFromPlaylist(){
    this.apollo
      .mutate({
        mutation: gql`
          mutation viewVid($id: ID!){
            viewPlaylist(id: $id){
              title
            }
          }
        `,
        variables: {
          id: parseInt(this.currentPlaylist.id),
        },
      })
      .subscribe(({ data }) => {
        console.log('got data', data);
        // this.isLiked = !this.isLiked;
        // console.log(this.isLiked);
        // this.addModeLink = false;
      },(error) => {
        console.log('there was an error sending the query', error);
      })
  }

  addToLib(){
    const passedId = +this.route.snapshot.paramMap.get('id');
    console.log("test")
    this.apollo
      .mutate({
        mutation: gql`
          mutation archived($id: String!, $plid: ID!) {
            archiveplaylist(id: $id, plid: $plid){
              archivedplaylists
            }
          }
        `,
        variables: {
          id: this.curUserId,
          plid: passedId
        },
        refetchQueries: [{
          query: gql`
            query getById($userid: String!){
              userById(userid: $userid){
                id,
                name,
                profilepic,
                subscribers,
                subscribed,
                likedvideos,
                likedcomments,
                disilikedvideos,
                disilikedcomments,
                archivedplaylists,
                premium,
              }
            }
          `,
          variables: {
            userid: this.curUserId,
          }
        }],
      })
      .subscribe(({ data }) => {
        console.log('got data', data);
        // this.isLiked = !this.isLiked;
        // console.log(this.isLiked);
        // this.addModeLink = false;
      },(error) => {
        console.log('there was an error sending the query', error);
      })
  }

  inLib = false;
  topthm;
  showShareModal = false;;

  toggleShareModal = () => {
      this.data.toggleShareModal(!this.showShareModal);
      console.log("tes")
  }

  ngOnInit(): void {

    this.data.currentShareModal.subscribe(showShareModal => this.showShareModal = showShareModal)

    const passedId = +this.route.snapshot.paramMap.get('id');
    // this.checkScroll()


    if(localStorage.getItem('users') == null){
      this.users = [];
      this.curUserId = "";
    }
    else{
      this.users = JSON.parse(localStorage.getItem('users'));
      this.user = this.users[0];
      // this.loggedIn = true;
      this.curUserId = this.user.id;
    }

    this.apollo
      .watchQuery({
        query: gql`
          query playlistById($id: Int!){
            playlistById(id: $id){
              id,
              title,
              userid,
              view,
              day,
              month,
              year,
              desc,
              videos,
              visibility,
            }
          }
        `,
        variables: {
          id: passedId,
        }
      })
      .valueChanges.subscribe(result => {
        this.currentPlaylist = result.data.playlistById
        this.currentPlaylist = this.currentPlaylist[0]
        console.log(this.currentPlaylist)

        if(this.user)
        {
          this.apollo.watchQuery({
            query: gql`
              query getById($userid: String!){
                userById(userid: $userid){
                  id,
                  name,
                  profilepic,
                  subscribers,
                  subscribed,
                  likedvideos,
                  likedcomments,
                  disilikedvideos,
                  disilikedcomments,
                  archivedplaylists,
                  premium,
                  notified,
                }
              }
            `,
            variables: {
              userid: this.curUserId,
            }
          })
          .valueChanges.subscribe(result => {
            this.currentUserInfo = result.data.userById
            this.currentUserInfo = this.currentUserInfo[0]

            this.inLib = this.currentUserInfo.archivedplaylists.includes(passedId) ? true : false
            console.log(this.inLib)
            this.subs = this.currentUserInfo.subscribed.split(",")
            if(this.subs.includes(this.currentPlaylist.userid))
            {
              this.isSubscribed = true;
            }
            else
            {
              this.isSubscribed = false;
            }

            this.notifieds = this.currentUserInfo.notified.split(",")
            if(this.notifieds.includes(this.currentPlaylist.userid))
            {
              this.isBelled = true;
            }
            else
            {
              this.isBelled = false;
            }
            // console.log(this.playlistOwner)
            this.isUserPrem = this.currentUserInfo.premium
          })
        }

        this.apollo.watchQuery({
          query: gql`
            query getById($userid: String!){
              userById(userid: $userid){
                name,
                profilepic,
                id,
                premium,
              }
            }
          `,
          variables: {
            userid: this.currentPlaylist.userid,
          }
        })
        .valueChanges.subscribe(result => {
          this.playlistOwner = result.data.userById
          this.playlistOwner = this.playlistOwner[0]
          console.log(this.playlistOwner)
        })

        this.apollo.watchQuery({
          query: gql`
            query videosByIds($id: String!){
              videosByIds(id: $id){
                id,
                title,
                thumbnail,
                channelname,
                userid,
                view,
                day,
                month,
                year,
                url,
                desc,
                premium,
              }
            }
          `,
          variables: {
            id: this.currentPlaylist.videos,
          }
        })
        .valueChanges.subscribe(result => {
          let v = result.data.videosByIds
          if(v.length != 0){
            this.topthm = v[v.length-1].thumbnail
          }
          let vinDb = this.currentPlaylist.videos.split(",")
          this.videos = new Array(v.length)
          for (let i = 0; i < v.length; i++) {
            this.videos[vinDb.indexOf(v[i].id)] = v[i]
          }

          // this.videos.forEach((element, index) => {
          //   // console.log(element, index)
          //   if(element == ''){
          //     console.log(index)
          //
          //     this.videos = this.videos.splice(index,1)
          //   }
          // });

          this.videos = this.videos.filter(function(element) {
            if(element != '') return element
          })

          if(this.isUserPrem == 'no'){
            this.videos = this.videos.filter(function(element) {
              if(element.premium != 'yes') return element
            })
          }


          // console.log(this.videos)
          // console.log(document.querySelector(".footer"))


        })
      })
  }

  ngAfterContentInit(){
    console.log(document.querySelector(".footer"))
    // root: document.querySelector(".playlistVideos")
    var intersectionOpt = {
      root: document.querySelector(".playlistVideos"),
      threshold: [0.5,1.0],
    }

    this.lastKey = 10;
    this.observer = new IntersectionObserver((entry) => {
      if(entry[0].isIntersecting){
        console.log("tes")
        let card = document.querySelector(".videosContainer")
        for(let i = 0; i < 5; i ++){
          if(this.lastKey < (this.videos ? this.videos.length : 0)){
            let outerdiv = document.createElement("div")
            let div = document.createElement("div")
            div.setAttribute('class', 'videoItem')
            let vid = document.createElement("app-video-block")
            vid.setAttribute("video", this.videos[this.lastKey])
            div.appendChild(vid)
            outerdiv.appendChild(div)
            card.appendChild(div)
            this.lastKey++
            console.log("testing")
          }
        }
      }
    }, intersectionOpt);



    this.observer.observe(document.querySelector(".footer"))
  }

}
