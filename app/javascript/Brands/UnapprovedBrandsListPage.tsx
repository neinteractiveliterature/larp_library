function UnapprovedBrandsListPage() {
  return (
    <>
      <h1>Brands pending approval</h1>
<table className="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Creator</th>
      <th>Created at</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <% @brands.order(:name).each do |brand| %>
      <tr>
        <td>
          <%= link_to brand.name, brand %>
        </td>
        <td>
          <% if brand.creator %>
            <%= mail_to brand.creator.email, brand.creator.name %>
          <% end %>
        </td>
        <td>
          <%= brand.created_at.to_date.to_s(:long) %>
        </td>
        <td>
          <%= link_to "Approve", [:approve, brand], method: "PATCH", className: "btn btn-success" %>
        </td>
      </tr>
    <% end %>
  </tbody>
</table>

    </>
  )
}
