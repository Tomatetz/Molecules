<div class="molecule-name-wrapper">
    <div class="core"><label><i class="fa fa-square-o fa-core" aria-hidden="true"></i><input type="radio" class="is-core" data-name="<%= name %>" name="core" ></label></div>
</div>
<div class="molecule-options-wrapper">
<ul class="molecule-options" >
    <li class="molecule-option">
        <% $.each(atomsWithAttach, function(i,atomNumber){ %>
        <label id="A<%= atomNumber %>">
            <div class="molecule-action action-wrapper"><span class="order-wrapper"><span class="attach-order">Attach </span><%= atomNumber %>:</span>
                <input placeholder="attach to" class="action-input" data-type="attach" data-atoms="<%= atomNumber %>" data-molecule="<%= name %>" type="text"
                       onkeypress='return (event.charCode >= 48 && event.charCode <= 57)||event.charCode==44||event.charCode==59||event.charCode==32||event.charCode==71' />
            </div>
        </label>
        <% }) %>
    </li>
</ul>
</div>
<div class="molecule-image-wrapper">
<div class="molecule-name"><%= name %></div>
<img class="image" src="">
<div class="molecule-remove"><i class="fa fa-trash-o" aria-hidden="true"></i></div>
</div>