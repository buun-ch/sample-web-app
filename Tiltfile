# -*- mode: Python -*-
# https://docs.tilt.dev/

allow_k8s_contexts(k8s_context())

config.define_string('registry')
config.define_bool('port-forward')
config.define_string('extra-values-file')

cfg = config.parse()

load('ext://helm_resource', 'helm_resource', 'helm_repo')

registry = cfg.get('registry', 'localhost:30500')
default_registry(registry)


docker_build(
    'sample-web-app-dev',
    '.',
    dockerfile='Dockerfile.dev',
    live_update=[
        sync('.', '/app'),
        run('pnpm install', trigger=['./package.json', './pnpm-lock.yaml']),
    ]
)

values_flags = ['--values=./charts/sample-web-app/values-dev.yaml']
extra_values_file = cfg.get('extra-values-file', '')
if extra_values_file:
    values_flags.append('--values=' + extra_values_file)
    print("📝 Using extra values file: " + extra_values_file)

helm_resource(
    'sample-web-app',
    './charts/sample-web-app',
    release_name='sample-web-app',
    flags=values_flags,
    image_deps=['sample-web-app-dev'],
    image_keys=[
        ('image.repository', 'image.tag')
    ]
)

enable_port_forwards = cfg.get('port-forward', False)
k8s_resource(
    'sample-web-app',
    port_forwards='13000:3000' if enable_port_forwards else [],
    labels=['app'],
)
if enable_port_forwards:
    print("🚀 Access your application at: http://localhost:13000")
