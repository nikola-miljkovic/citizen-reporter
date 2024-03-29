import redis
import pickle
import sys
import indicoio
import numpy as np
import json
import scipy as sp

from sklearn.linear_model import LogisticRegression

with open("classifier" + str(sys.argv[1]) + ".pickle", 'rb') as handle:
    clf = pickle.load(handle)


indicoio.config.api_key = "bca760a95d156cbbad4729cb9cd4cb0e"

r = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)
p = r.pubsub()
p.subscribe("trending_updated")

while True:
    for l in p.listen():
        message = json.loads(r.get('trending:us').decode("utf-8"))
        for post in message:
            posts = json.loads(r.get('tag:' + post).decode("utf-8"))
            print(posts)
            X_test = np.zeros(shape=[111, 1])
            y_predict_proba = np.zeros(shape=[len(posts), 2])
            ret = []
            for i in range(0, len(posts)):
                text_tags = indicoio.text_tags(posts[i]["text"], version=2)
                X_test[:, 0] = list(text_tags.values())
                y_predict_proba[i, :] = clf.predict_proba(X_test.T)
                ret.append((y_predict_proba[i, 1], i))

            ret = sorted(ret, key=lambda x: x[0])
            print(ret)
            queue = []
            for i in range(0, min(10, len(ret))):
                pop = ret[min(10, len(ret)) - i - 1]
                queue.append({'proba': pop[0], 'index': pop[1]})

        r.set('tag:queue', json.dumps(queue))
        r.publish("prediction_finished", "done")
