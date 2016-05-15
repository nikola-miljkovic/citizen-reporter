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

r = redis.StrictRedis(host='193.2.178.131', port=6379, db=0)
p = r.pubsub()
p.subscribe("trending_updated")

while True:
    message = p.get_message()
    posts = json.loads(message)
    X_test = np.zeros(shape=[111, 1])
    y_predict_proba = np.zeros(shape=[len(posts), 2])
    ret = []
    for i in range(0, len(posts)):
        text_tags = indicoio.text_tags(posts[i]["text"], version=2)
        X_test[:, 0] = list(text_tags.values())
        y_predict_proba[i, :] = clf.predict_proba(X_test.T)
        ret.insert((y_predict_proba[1], i))

    ret.sort(lambda x, y: y if x(0) > y(0) else x)

    queue = [dict() for x in range(0, 10)]
    for i in range(0, 10):
        pop = ret.pop()
        queue.insert({'proba': pop(0), 'index': pop(1)})

    p.publish("prediction_finished")

