class GameEventWorker < IronWorker::Base

  merge_gem 'pusher'

  def run
    Pusher.app_id = '16388'
    Pusher.key = '657713b267a64758afbf'
    Pusher.secret = '76880982a00c971cf7fe'

    (30+70*Random.rand).to_i.times do 
      Pusher['presence-mapgame_global'].trigger!('server_game_event', {
        :type => 'spawn',
      })
      sleep 1
    end
  end
end
