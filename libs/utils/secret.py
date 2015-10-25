import random

def load_secret_key(secret_file, length):
    try:
        secret_key = open(secret_file).read().strip()
    except IOError:
        try:
            secret_key = gen_secret_key(length)
            with open(secret_file, 'w') as f:
                f.write(secret_key)
        except IOError:
            raise Exception('Cannot open file `%s` for writing.' % secret_file)
    return secret_key


def gen_secret_key(length):
    return ''.join([random.SystemRandom().choice('abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)') for i in range(length)])
