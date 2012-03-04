require 'yaml'
YAML::ENGINE.yamler = 'syck'
EB_CLIENT = EventbriteClient.new({app_key: 'HAEPTXJKMP6GPLTHZI'})
