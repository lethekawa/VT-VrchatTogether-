export const UserTagColor = {
    'system_trust_legend': '#f8bc3a',
    'system_trust_veteran': '#be64a5',
    'system_trust_trusted': '#be64a5',
    'system_trust_known': '#ff781e',
    'system_trust_basic': '#64be46',
    'none': '#dcdcdc'
}

export const UserTagName = {
    'system_trust_legend': 'Legend',
    'system_trust_veteran': 'Veteran',
    'system_trust_trusted': 'Trusted',
    'system_trust_known': 'Known',
    'system_trust_basic': 'Basic',
    'none': 'None'
}

export function UserGrade(tags){
    if(tags === undefined || tags == null){
        return UserTagColor.none;
    }
    let tagList = tags.join('/')

    if(tagList.includes('system_trust_legend')) return UserTagColor.system_trust_legend;
    if(tagList.includes('system_trust_veteran')) return UserTagColor.system_trust_veteran;
    if(tagList.includes('system_trust_trusted')) return UserTagColor.system_trust_trusted;
    if(tagList.includes('system_trust_known')) return UserTagColor.system_trust_known;
    if(tagList.includes('system_trust_basic')) return UserTagColor.system_trust_basic;
    else return UserTagColor.none;
}

export function UserGradeName(tags){
    if(tags === undefined || tags == null){
        return UserTagName.none;
    }
    let tagList = tags.join('/')

    if(tagList.includes('system_trust_legend')) return UserTagName.system_trust_legend;
    if(tagList.includes('system_trust_veteran')) return UserTagName.system_trust_veteran;
    if(tagList.includes('system_trust_trusted')) return UserTagName.system_trust_trusted;
    if(tagList.includes('system_trust_known')) return UserTagName.system_trust_known;
    if(tagList.includes('system_trust_basic')) return UserTagName.system_trust_basic;
    else return UserTagName.none;
}