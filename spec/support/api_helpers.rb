# frozen_string_literal: true

module ApiHelpers
  def expect_json_api_match(path, expected_id, attributes = {})
    get path

    expect(response).to have_http_status(:ok)
    expect(response.content_type).to match(%r{application/(json|vnd\.api\+json)})

    json = JSON.parse(response.body)
    expect(json['data']['id']).to eq(expected_id.to_s)

    attributes.each do |key, value|
      expect(json['data']['attributes'][key.to_s]).to eq(value)
    end
    json
  end

  def expect_json_api_missing(path)
    get path

    expect(response).to have_http_status(:not_found)
    expect(response.content_type).to match(%r{application/(json|vnd\.api\+json)})

    json = JSON.parse(response.body)
    expect(json).to have_key('errors')
    expect(json['errors'].first['status']).to eq('404')
    expect(json['errors'].first['detail']).to eq('Specified Record Not Found')
  end

  def expect_json_api_relationships(path, relationships_to_check)
    get path

    expect(response).to have_http_status(:ok)
    json = JSON.parse(response.body)
    relationships = json['data']['relationships']

    expect(relationships).to be_present

    relationships_to_check.each do |rel_name, expected_route_part|
      expect(relationships).to have_key(rel_name.to_s)
      expect(relationships[rel_name.to_s]).to have_key('links')
      expect(relationships[rel_name.to_s]['links']).to have_key('related')
      expect(relationships[rel_name.to_s]['links']['related']).to include(expected_route_part)
    end
  end
end
