<span class="order-wrapper">
        <span class="closing-order">Closing </span>
    </span>
<div class="closing-input">
to atom <%= atoms[0] %>:
<select data-atom = "<%= atoms[0] %>">
    <option></option>
    <% _.each(atomsWithAttach, function(atom){ %>
    <option><%= atom %></option>
    <% }) %>
</select>
</div>
<div class="closing-input">
to atom <%= atoms[1] %>:
<select data-atom = "<%= atoms[1] %>">
    <option></option>
    <% _.each(atomsWithAttach, function(atom){ %>
    <option><%= atom %></option>
    <% }) %>
</select>
</div>