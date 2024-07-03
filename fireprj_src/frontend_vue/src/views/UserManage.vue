<template>
  <main-layout>
    <template v-slot>
      <div class="main-panel">
        <v-toolbar color="light-blue darken-4" dark flat>
          <v-toolbar-title>User mamagement</v-toolbar-title>
        </v-toolbar>

        <v-card flat height="100">
          <v-toolbar rounded dense class="elevation-1" height="100">
            <v-col cols="7">
              <v-text-field outlined dense hide-details
                            placeholder="User search"
                            append-icon="mdi-magnify"
                            v-model="users.search"
                            @keydown.enter="getUser()"
                            class="m-right"
              />
            </v-col>
            <v-col cols="1">
              <v-btn depressed dark big
                      color="light-blue darken-2"
                      @click="getUser()">
                
                <div class="ml-1">Search</div>
              </v-btn>
            </v-col>
            <v-col cols="1">
              <v-btn depressed dark big
                      color="light-blue darken-2"
                      @click="openAddPopup()"
                      class="m-left">
                <div class="ml-1">Add</div>
              </v-btn>
            </v-col>
            <v-col cols="1">
              <v-btn depressed dark big
                      color="light-blue darken-2"
                      class="m-left"
                      @click="downloadExcel()">
                <v-icon small>mdi-arrow-down-bold-outline</v-icon>
                <div class="ml-1">xls Download</div>
              </v-btn>
            </v-col>
          </v-toolbar>
        </v-card>

        <v-data-table
          :headers="users.headers"
          :items="users.data"
          :loading="users.loading"
          :options.sync="users.options"
          :server-items-length="users.total"
          :search="users.search"
          :items-per-page="5"
          :footer-props="{'items-per-page-options': [5, 10, 15,20,25,30,-1],'items-per-page-text': `Rows per page`}"
          @click:row="openViewPopup"
          class="elevation-1 mt-4 clickable-row">
          <template v-slot:[`item.user_pwd`]="{item}">
            *****
          </template>           
          <template v-slot:[`item.user_status`]="{item}">
            {{user_status_list.find(v=>v.code==item.user_status).name}}
          </template>           
          <template v-slot:[`item.user_role`]="{item}">
            {{user_role_list.find(v=>v.code==item.user_role).name}}
          </template>                     
          <template v-slot:[`item.delete`]="{item}">
            <v-btn depressed small color="#aaaaaa"
                    dark class="ml-1"
                    @click.stop
                    @click="openModifyPopup(item,'MODIFY')">
              Modify
            </v-btn>            
            <v-btn depressed small color="deep-orange accent-4"
                    dark class="ml-1"
                    @click.stop
                    @click="openDeletePopup(item)">
              Delete
            </v-btn>
          </template>
        </v-data-table>

        <v-dialog v-model="addPopup.show" persistent max-width="500px">
          <v-card :loading="loading" :disabled="loading">
            <v-card-title class="pt-2 pb-1 primary white--text">
              <span class="body-1">{{getPopupTitle(addPopup.popup_type)}}</span>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-container>
                <v-card>
                  <abl-document class="abl-page-popup" ref="report-popup">
                    <abl-doc-body class="abl-doc-body-popup">
                      <table class="abl-table-ts-popup">
                        <colgroup>
                          <col style="width: 25%" />
                        </colgroup>
                        <tr>
                            <th class="s-h" colspan="2" rowspan="1">User ID</th>
                            <td colspan="2">
                               <input :disabled="addPopup.popup_type == 'VIEW'" type="text" placeholder="English ID" class="abl-input" v-model="addPopup.form.user_id"/>
                            </td>
                        </tr>          
                        <tr v-if="addPopup.popup_type == 'MODIFY'">
                          <th class="s-h" colspan="2" rowspan="1">Current Password</th>
                          <td colspan="2">
                            <input :disabled="addPopup.popup_type == 'VIEW'" type="text" placeholder="*******" class="abl-input" v-model="addPopup.form.user_pwd_c"/>
                          </td>
                        </tr>           
                        <tr v-if="addPopup.popup_type == 'MODIFY'">
                          <th class="s-h" colspan="2" rowspan="1">Change Password</th>
                          <td colspan="2">
                            <input :disabled="addPopup.popup_type == 'VIEW'" type="text" placeholder="*******" class="abl-input" v-model="addPopup.form.user_pwd"/>
                          </td>
                        </tr>                                       
                        <tr v-else>
                          <th class="s-h" colspan="2" rowspan="1">User password</th>
                          <td colspan="2">
                            <input :disabled="addPopup.popup_type == 'VIEW'" type="text" placeholder="*******" class="abl-input" v-model="addPopup.form.user_pwd"/>
                          </td>
                        </tr>   
                        <tr>
                          <th class="s-h" colspan="2" rowspan="1">User name</th>
                          <td colspan="2">
                            <input :disabled="addPopup.popup_type == 'VIEW'" type="text" placeholder="User name" class="abl-input" v-model="addPopup.form.user_name"/>
                          </td>
                        </tr>   
                        <tr>
                          <th class="s-h" colspan="2" rowspan="1">User status</th>
                          <td colspan="2">
                              <v-select dense hide-details
                                  v-model="addPopup.selected_status"
                                  :items="user_status_list"
                                  item-text="name"
                                  item-value="code"
                                  @change="onChangeUserStatus"
                                  :disabled="addPopup.popup_type == 'VIEW' || !$session.isAdmin()"
                                >
                              </v-select>
                          </td>
                        </tr>     
                        <tr>
                          <th class="s-h" colspan="2" rowspan="1">User permission</th>
                          <td colspan="2">
                              <v-select dense hide-details
                                  v-model="addPopup.selected_role"
                                  :items="user_role_list"
                                  item-text="name"
                                  item-value="code"
                                  @change="onChangeUserRole"
                                  :disabled="addPopup.popup_type == 'VIEW' || !$session.isAdmin()"
                                >
                              </v-select>
                          </td>
                        </tr>       
                      </table>
                    </abl-doc-body>
                  </abl-document>                                   
                </v-card>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn
                  color="light-blue darken-2"
                  class="flex-grow-1"
                  text
                  @click="addPopup.show=false"
              >
              Close
              </v-btn>
              <v-btn
                  color="light-blue darken-2"
                  class="flex-grow-1"
                  tile
                  dark
                  depressed
                  @click="addUser"
                  v-if="addPopup.popup_type != 'VIEW'"
              >
              {{getPopupTitle(addPopup.popup_type)}}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <v-dialog v-model="deletePopup.show" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span>Are you sure you want to delete?</span>
            </v-card-title>
            <v-card-action>
              <v-btn color="light-blue darken-2"
                      class="flex-grow-1"
                      text
                      @click="deletePopup.show=false">
                      Cancel  
              </v-btn>
              <v-btn color="primary"
                      class="flex-grow-1 ml-2"
                      dark depressed
                      @click="deleteUser()">
                Delete  
              </v-btn>
            </v-card-action>
          </v-card>
        </v-dialog>

      </div>
    </template>
  </main-layout>
</template>

<script>
import axios from "axios";
export default {
  props: {
  },
  components: {},
  methods: {
    clearUser() {
      this.addPopup.form =  {
          user_id: '',
          user_pwd: '',
          user_pwd_c: '',
          user_name: '',
          user_status: '',
          user_role: '',
        }      
    },
    openAddPopup() {
      if(!this.$session.isAdmin()){
        alert("You do not have permission.")
        return
      }      
      this.clearUser()
      this.addPopup.selected_status = this.user_status_list[0]
      this.addPopup.selected_role = this.user_role_list[0]
      this.addPopup.popup_type = 'ADD'
      this.addPopup.form.user_status = this.addPopup.selected_status.code
      this.addPopup.form.user_role = this.addPopup.selected_role.code            
      this.addPopup.show = true

    },
    openModifyPopup(item,type) {
      if(this.$session.isAdmin() || (!this.$session.isAdmin() && this.$session.getUserId() == item.user_id)){
        this.addPopup.selected_status = this.user_status_list.find(v => v.code == item.user_status)
        this.addPopup.selected_role = this.user_role_list.find(v => v.code == item.user_role)
        this.addPopup.form.user_status = this.addPopup.selected_status.code
        this.addPopup.form.user_role = this.addPopup.selected_role.code
        this.addPopup.form.user_id = item.user_id
        this.addPopup.form.user_pwd = '*****'
        this.addPopup.form.user_pwd_c = '*****'
        this.addPopup.form.user_name = item.user_name
        this.addPopup.form.id = item.id
        this.addPopup.popup_type = type
        this.addPopup.show = true      
      }else{
        alert("You do not have permission.")
        return
      }      
      
    },
    openViewPopup(item){
      this.openModifyPopup(item,'VIEW')
    },
    getPopupTitle(type){
      if(type == 'ADD') return 'User register'
      if(type == 'MODIFY') return 'User modify'
      if(type == 'VIEW') return 'User infomation'
    },
    onChangeUserStatus(status) {
      this.addPopup.form.user_status = status
    },
    onChangeUserRole(role) {
      this.addPopup.form.user_role = role
    },    
    async getUser() {

      const { page, itemsPerPage, sortBy, sortDesc } = this.users.options;
      try {
        let filters_or = []
        let filters_and = []
        let order_by = []
        if (this.users.search) {
          filters_or.push({name: 'user_id', op: 'like', val: `%${this.users.search}%`})
        }
        if (sortBy.length) {
          for (let i=0; i<sortBy.length; i++) {
            order_by.push({field: sortBy[i], direction: sortDesc[i] ? 'desc' : 'asc'})
          }
        }else{
          order_by.push({field: "id", direction: 'asc'})
        }

        let q = {
          filters: [{or: filters_or}, {and: filters_and}],
          order_by
        }
        let params = {
          q: q,
          results_per_page: itemsPerPage,
          page: page,
        };

        let { data } = await this.$http.get("user", { params });
        this.users.total = data.num_results;
        this.users.data = data.objects.map((v, i) => {
          v._index = i + (page - 1) * itemsPerPage + 1;
          return v;
        });
      } catch (err) {
        console.error(err);
      } finally {
        this.users.loading = false;
      }   
    },
    async addUser() {
      let param = {
        user_id: this.addPopup.form.user_id,
        user_pwd: this.addPopup.form.user_pwd,
        user_name: this.addPopup.form.user_name,
        user_status: this.addPopup.form.user_status,
        user_role: this.addPopup.form.user_role,
      }

      if(this.addPopup.form.user_id == undefined || this.addPopup.form.user_id.length < 2){
        alert("Please enter your ID!")
        return
      }
      if(this.addPopup.form.user_name == undefined || this.addPopup.form.user_name.length < 4){
        alert("Input your name, please!")
        return
      }       
      if(this.addPopup.form.user_pwd == undefined || this.addPopup.form.user_pwd.length < 2){
        alert("Please enter your password!")
        return
      }       
      if (this.addPopup.popup_type == 'ADD') {
        await this.$http.post("user", param)
      } else {
        if(this.addPopup.form.user_pwd != '*****') {
          let param_pwd = {
            user_id: this.addPopup.form.user_id,
            user_pwd: this.addPopup.form.user_pwd_c,          
          }
          let res = await this.$http.post("check_passwd", param_pwd)
          if(res.data.result == 0){
            alert('It does not match your existing password.')    
            return
          }
        }
        if(this.addPopup.form.user_pwd == '*****')
          delete param['user_pwd']
        await this.$http.patch(`user/${this.addPopup.form.id}`, param)  
      }
      this.getUser()
      this.addPopup.show = false;
    },
    popupUserData(e, {item}) {
      this.infoPopup.form = item;
      this.infoPopup.show = true;
    },
    // async modifyUserData() {
    //   let param = this.infoPopup.form;
    //   delete param.customer;
    //   await this.$http.patch(`user/${param.id}`, param)
    //   this.getUser()
    //   this.infoPopup.show = false;
    // },
    openDeletePopup(item) {
      if(!this.$session.isAdmin()){
        alert("You do not have permission.")
        return
      }      
      this.deletePopup.delTarget = item.id;
      this.deletePopup.show = true;
    },
    async deleteUser() {
      let param = this.deletePopup.delTarget;
      await this.$http.delete(`user/${param}`)
      this.getUser()
      this.deletePopup.show = false;
    },
    async downloadExcel() {
      let params = {
        "page_name": "user",
        "headers": (() => {
          let headers_text = []
          for (let i=1; i < this.users.headers.length-1; i++) {
            headers_text.push(this.users.headers[i].text)
          }
          return headers_text
        })()
      }
      let {data} = await this.$http.post('make_excel', params)

      var url = this.$session.getWebURL() + '/api/v1/save_excel/' + data.filename
      axios({
        method: 'get',
        url:url,
        responseType: 'blob'
      })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data], {
          type: 'application/vnd.ms-excel'
        }))
        const link = document.createElement('a')
        link.href = url
        var download_file_name = "사용자목록_" + Date.now().toString() + ".xlsx"
        link.setAttribute('download', download_file_name)
        link.click()
      })
      .catch(() => console.log('error: excel download error'))
    }
  },
  mounted() {
    this.getUser()
  },
  watch: {
    "users.options": {
      handler() {
        this.getUser()
      },
      deep: true,
    },
  },
  data() {
    return {
      users: {
        headers: [
          {text: 'No.', value: 'id', sortable: false, align: 'center', width: 20 },
          {text: 'User ID', value: 'user_id', sortable: false,align: 'center', width: 80},
          {text: "User Password", value: "user_pwd",align: 'center', sortable: false, width: 60},
          {text: "User name", value: "user_name",align: 'center', sortable: false, width: 40},
          {text: "User status", value: "user_status",align: 'center', sortable: false, width: 20},
          {text: "User permission", value: "user_role",align: 'center', sortable: false, width: 20},
          {text: "Modify/Delete", value: "delete",align: 'center', sortable: false, width: 10},
        ],
        data: [],
        options: {"page":1,"itemsPerPage":10,"sortBy":[],"sortDesc":[],"groupBy":[],"groupDesc":[],"mustSort":false,"multiSort":false},
        loading: false,
        search: '',
        total:0
      },
      loading: false,
      addPopup: {
        show: false,
        form: {
          user_id: '',
          user_pwd: '',
          user_pwd_c: '',
          user_name: '',
          user_status: '',
          user_role: '',
          id:''
        },
        loading:false,
        popup_type: 'ADD',
        selected_status: null,
        selected_role:null
      },
      infoPopup: {
        show: false,
        form: {}
      },
      deletePopup: {
        show: false,
        delTarget: ''
      },
      user_status_list: [
        { name:'Unused',code: 0},        
        { name: 'Used', code: 1 }
      ],
      user_role_list: [
        { name:'Search',code: 0},        
        { name: 'Management', code: 1 }
      ]      
    };
  },
};
</script>

<style lang="scss" scoped>
.main-panel {
  padding: 10px;
  height: calc(100vh - 80px);
  overflow-y: auto;
}
.main-panel .v-data-table header {
  font-size: 14px;
}
.main-panel .v-data-table th {
  font-size: 14px;
}
.main-panel .v-data-table td {
  font-size: 14px;
}
td {
  text-align: center;
}

.flex-grow-1{
  margin-left:10px;
  margin-bottom: 10px;
  width:48%;
}
</style>
