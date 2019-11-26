$(function() { 
  // メッセージ表示のHTML生成
  function buildHTML(message){
    var imagehtml = message.image == null ? "" : `<img src="${message.image}" class="lower-message__image">`

    var html = `<div class=“message” data-message-id=${message.id}>
                    <div class="upper-message">
                      <div class="upper-message__user-name">
                      ${message.user_name}
                      </div>
                      <div class="upper-message__date">
                      ${message.created_at}
                      </div>
                    </div>
                    <div class="lower-message">
                      <p class="lower-message__content">
                      ${message.content}
                      </p>
                      ${imagehtml}
                    </div>
                  </div> `
    return html;
  }
  // メッセージの非同期通信
    $('#new_message').on('submit', function(e){
      e.preventDefault(); 
      var formData = new FormData(this);
      var href = window.location.href
  
      $.ajax({
        url: href,
        type: 'POST',
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false
      })
      .done(function(data){
        var html = buildHTML(data);
        $('.messages').append(html); 
        $('.form__submit').prop("disabled",false);
        $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight },'fast');
        $('.form__message').val('');
        $('.hidden').val('');
      })
      .fail(function(data){
        alert('入力してください');
        $(".form__submit").attr("disabled",false);
      })
    });
    //　自動更新
    var reloadMessages = function() {
      if (window.location.href.match(/\/groups\/\d+\/messages/)){//今いるページのリンクが/groups/グループID/messagesのパスとマッチすれば以下を実行。
        var last_message_id = $('.message:last').data("message-id"); //dataメソッドで.messageにある:last最後のカスタムデータ属性を取得しlast_message_idに代入。
          
          $.ajax({
          url: "api/messages",
          type: 'GET',
          data: { last_id: last_message_id },
          dataType: 'json'
        })
        .done(function(messages) {
            messages.forEach(function(message) {
            var html = buildHTML(message);
              $('.message').append(html);
              $('.message').animate({scrollTop: $('.messages')[0].scrollHeight },'fast'); 
          })
        })
        .fail(function() {
          alert('自動更新に失敗しました');
        });
      }
    }; 
      setInterval(reloadMessages, 7000);
  }); 