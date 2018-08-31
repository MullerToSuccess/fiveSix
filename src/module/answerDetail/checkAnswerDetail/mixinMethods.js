/* 混入组件的函数
* 防止文件冲突 */
/* eslint-disabled */
export default {
  methods: {
    emitPaint({idx}, event) {
      console.log(222, this);
      let answer = this.studentAnswerDetailData,
        {studentListArray, answerInfo, answerInfo: {pics, characters}, userid} = this,
        self = this,
        hasText = !(characters === '' || (Array.isArray(characters) && (characters.length < 1 || characters[0].length < 1)));
      if (!hasText && Object.keys(pics || {}).length < 1) {
        this.$toast('没有可批改内容');
        return;
      }
      console.log(333);
      new Promise(resolve => {
        if (hasText) {
          let hOld = $('#markdetail .stu-ans-item-box .answer').height() || 0,
            width = screen.availWidth;
          let h1 = Math.ceil(hOld > width / 4 * 3 ? hOld : width / 4 * 3);
          let $div = $('<div class="char-parent">').css({
            minHeight: h1 + 'px'
          }).appendTo($('body'));
          if (Array.isArray(characters)) {
            $div.append($('#answerView').clone());
          } else {
            $div.append(`<p class="char-item">${characters}</p>`);
          }
          html2canvas($div, {
            onrendered(canvas) {
              let picData = canvas.toDataURL();
              $div.remove();
              resolve(picData);
            },
            width,
            height: h1
          });
        } else {
          if (idx === -1) {
            idx = 0;
          }
          console.log(444);
          resolve('none');
        }
      }).then(picData => {
        if (window.platform === "android") {
          let imgJson = {
            Info: {
              course_hour_publish_id: answer['course_hour_publish_id'],
              course_resource_id: answer['course_resource_id'],
              dcom_entity_id: answer['dcom_entity_id'],
              qti_question_id: answer['source_pk_id'],
              studentid: studentListArray[self.studentOneDetail.num - 1].userid,
              teacher_id: userid
            },
            ImgInfo: answerInfo.images.map((itm, i) => {
              let pic = pics[i] || [];
              return {
                position: i,
                text: "",
                mixUrl: pic[0] || itm,
                baserUrl: itm,
                base64: ""
              }
            })
          };
          if (picData !== 'none') {
            imgJson.ImgInfo.unshift({
              position: -1,
              mixUrl: (pics[-1] && pics[-1][0]) || "",
              text: '',
              baserUrl: "",
              base64: picData.slice(21)
            });
            idx++;
          }
          appPlug.studentWork([
            JSON.stringify(imgJson),
            self.env,
            userid,
            idx
          ], () => {
            self.getStudentAnswerList();
          });
        } else {
          /* in ios */
          let info = {
              publish_id: answer['course_hour_publish_id'],
              course_resource_id: answer['course_resource_id'],
              dcom_entity_id: answer['dcom_entity_id'],
              qti_question_id: answer['source_pk_id'],
              student_id: studentListArray[self.studentOneDetail.num - 1].userid,
              teacher_id: userid
            }, images = {};
          sessionStorage.setItem('studentOneDetail.num', self.studentOneDetail.num);
          answerInfo.images.forEach((itm, i) => {
            let pic = pics[i] || [];
            if (itm) {
              Object.assign(images, {
                [i]: {
                  img: pic[0] || itm,
                  orgimg: itm
                }
              });
            }
          });
          if (picData !== 'none') {
            Object.assign(images, {
              '-1': {
                img: (pics[-1] && pics[-1][0]) || picData,
                orgimg: picData
              }
            });
          }
          // return
          self.$router.push({
            name: 'CheckDetail',
            params: {
              images,
              num: idx,
              env: self.env,
              info
            }
          });
        }
      });
    }
  }
}
